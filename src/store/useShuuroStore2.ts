import { defineStore } from "pinia";
import init, { ShuuroShop, ShuuroPosition } from "shuuro-wasm";
import { Clock } from "@/plugins/clock";
import Chessground from "@/plugins/chessground";
import router from "@/router";
import { ServerDate } from "@/plugins/serverDate";
import { ws, SEND } from "@/plugins/webSockets";
import { anonConfig, liveConfig } from "@/plugins/chessground/configs";
import { Api } from "@/plugins/chessground/api";

export const useShuuroStore2 = defineStore("shuuro2", {
  state: (): ShuuroStore => {
    return emptyState();
  },
  actions: {
    // convert server data to store
    fromServer(s: any, username: string) {
      this.$state.game_id = s.game_id;
      this.$state.min = s.min;
      this.$state.incr = s.incr;
      this.$state.side_to_move = s.side_to_move;
      this.$state.last_clock = s.last_clock;
      this.$state.current_stage = s.current_stage;
      this.$state.client_stage = s.current_stage;
      this.$state.result = s.result;
      this.$state.status = s.status;
      this.$state.shop_history = s.shop_history;
      this.$state.deploy_history = s.deploy_history;
      this.$state.fight_history = s.fight_history;
      this.$state.players = [s.white, s.black];
      this.$state.clocks = [
        new Clock(s.min / 60000, s.incr / 1000, 0, "1"),
        new Clock(s.min / 60000, s.incr / 1000, 0, "0"),
      ];
      this.$state.credits = [s.white_credit, s.black_credit];
      this.$state.clock_ms = [s.white_clock, s.black_clock];
      this.setPlayer(username);
      this.$state.flipped_board = this.$state.player == 1 ? true : false;
      this.$state.credit =
        this.$state.player == 0
          ? this.$state.credits[0]
          : this.$state.credits[1];
      this.$state.player_color = this.getColor(username) as Color;
      this.$state.confirmed_players = [false, false];
      router.push({ path: `/shuuro/${s.current_stage}/${s.game_id}` });
      SEND({
        t: "live_game_hand",
        color: this.$state.player_color,
        game_id: this.$state.game_id,
      });
      SEND({
        t: "live_game_confirmed",
        color: this.$state.player_color,
        game_id: this.$state.game_id,
      });
    },

    // set wasm for all stages
    setWasm(color: string): void {
      // eslint-disable-next-line
      init().then((_exports) => {
        if (this.credit == 800 || color == "n") {
          this.$state.shop_wasm = new ShuuroShop();
          this.$state.deploy_wasm = new ShuuroPosition();
          this.$state.fight_wasm = new ShuuroPosition();
          //sethand
          //wasmObject.setHand(reponse.hand);
          //credit.value = wasmObject.getCredit(color.value);
        }
      });
    },

    // set player(if any)
    setPlayer(username: string) {
      if (username == this.$state.players[0]) {
        this.$state.player = 0;
        this.am_i_player = true;
      } else if (username == this.$state.players[1]) {
        this.$state.player = 1;
        this.am_i_player = true;
      } else {
        this.am_i_player = false;
      }
    },

    // new stage for game
    updateClientStage(stage: Stage): void {
      this.$state.client_stage = stage;
    },

    // toggle side to move
    toggleStm(): void {
      if (this.$state.side_to_move == "black") {
        this.$state.side_to_move = "white";
      } else if (this.$state.side_to_move == "white") {
        this.$state.side_to_move = "black";
      }
    },

    // SHOP PARTS
    // buying piece
    buy(p: string, color: string) {
      const new_credit = this.$state.shop_wasm.getCredit(color);

      if (new_credit <= this.$state.credit! && !this.amIConfirmed()) {
        this.$state.piece_counter = this.$state.shop_wasm.buy(p);
        const new_credit = this.$state.shop_wasm.getCredit(color);
        const counter = this.$state.shop_wasm.get_piece(p);
        // ws send move to server
        const game_move = `+${p}`;
        this.$state.shop_history?.push([`${game_move} ${counter}`, counter]);
        SEND({
          t: "live_game_buy",
          game_id: this.$state.game_id,
          game_move: game_move,
        });
        this.$state.current_index = this.$state.shop_history?.length! - 1;
        this.$state.credit! = new_credit;
      }
    },

    // confirm shopping list
    confirm(username: string) {
      if (
        this.$state.am_i_player &&
        this.$state.current_stage == "shop" &&
        !this.amIConfirmed()
      ) {
        this.$state.shop_wasm.confirm(this.$state.player_color);
        if (this.$state.shop_wasm.isConfirmed(this.$state.player_color)) {
          SEND({
            t: "live_game_confirm",
            game_id: this.$state.game_id,
            game_move: "cc",
          });
          this.clockPause(this.$state.player!);
          this.$state.confirmed_players![this.$state.player!] = true;
          // ws send send move to server
          //this.$state.shop_wasm.free();
        }
      }
    },

    // get from server confirmed and set
    setConfirmed(data: [boolean, boolean]) {
      this.$state.confirmed_players = data;
      this.activateClock();
      if (this.amIConfirmed()) {
        let ms = this.$state.clock_ms[this.$state.player!];
        let clock = this.$state.clocks[this.$state.player!];
        (clock as Clock).pause(true);
        (clock as Clock).setTime(ms!);
      }
    },

    // start clocks
    activateClock(): void {
      this.clock(0).onTick(this.clock(0).renderTime);
      this.clock(1).onTick(this.clock(1).renderTime);
      if (this.$state.status < 0) {
        if (this.$state.current_stage == "shop") {
          let confirmed = this.$state.confirmed_players?.findIndex(
            (item) => item == true
          );
          if (confirmed != -1) {
            this.clock(confirmed!).setTime(this.$state.clock_ms[confirmed!]);
            this.clock(confirmed!).pause(false);
            let otherClock = confirmed == 0 ? 1 : 0;
            this.clock(otherClock).start(this.$state.clock_ms[otherClock]);
            return;
          }
          const now = new Date();
          const converted_date = ServerDate(this.$state.last_clock!);
          const elapsed = now.getTime() - converted_date.getTime();
          this.$state.clock_ms[0] -= elapsed;
          this.$state.clock_ms[1] -= elapsed;

          this.clock(0).start(this.$state.clock_ms[0]);
          this.clock(1).start(this.$state.clock_ms[1]);
        } else {
          this.clock(0).setTime(this.$state.clock_ms[0]);
          this.clock(1).setTime(this.$state.clock_ms[1]);
        }
      }
    },

    // pause one of clocks
    clockPause(id: number) {
      this.clock(id).pause(true);
    },

    // set deploy chessground
    setDeployCg(element: HTMLElement) {
      const config = this.$state.am_i_player ? liveConfig : anonConfig;
      this.$state.deploy_cground = Chessground(element!, config) as Api;
    },

    // set fight chessground
    setFightCg(element: HTMLElement) {
      const config = this.$state.am_i_player ? liveConfig : anonConfig;
      this.$state.fight_cground = Chessground(element!, config) as Api;
    },

    // pause current and start another clock
    switchClock() {
      let w = this.clock(0);
      let b = this.clock(1);
      if (w.running) {
        w.pause(true);
        b.start();
      } else if (b.running) {
        b.pause(true);
        w.start();
      }
    },

    // redirect player
    redirect(path: string) {
      if (path != undefined) {
        router.push({ path: path });
      }
    },

    // set user hand
    setShuuroHand(hand: string, user: string): void {
      // eslint-disable-next-line
      init().then((_exports) => {
        this.$state.shop_wasm = new ShuuroShop();
        (this.$state.shop_wasm as ShuuroShop).set_hand(hand);
        this.$state.piece_counter = this.$state.shop_wasm.shop_items(
          this.$state.player_color
        );
      });
    },

    // GETTERS
    clock(id: number): Clock {
      return this.$state.clocks[id] as Clock;
    },
    myClock(): Clock {
      return this.$state.clocks[this.$state.player!];
    },
    amIConfirmed(): boolean {
      return this.$state.confirmed_players![this.$state.player!];
    },
    deployCground(): Api {
      return this.$state.deploy_cground!;
    },
    fightCground(): Api {
      return this.$state.fight_cground!;
    },
    canConfirm1(): boolean {
      return this.$state.am_i_player! && this.$state.current_stage == "shop";
    },
    getColor(username: string): string {
      let index = this.$state.players.findIndex((item) => item == username)!;
      return index == 0 ? "white" : "black";
    },
    getHistory(): FenItem[] | undefined {
      switch (this.client_stage) {
        case "shop":
          return this.shop_history;
        case "deploy":
          return this.deploy_history;
        case "fight":
          return this.fight_history;
      }
    },
  },
});

function emptyState(): ShuuroStore {
  return {
    min: 0,
    incr: 0,
    players: ["", ""],
    clocks: [0, 0],
    hands: ["", ""],
    credits: [0, 0],
    clock_ms: [0, 0],
    confirmed_players: [false, false],
    current_stage: "shop",
    result: "",
    status: -2,
    game_started: "",
    game_id: "",
    rated_game: false,
    side_to_move: "white",
    player_color: "white",
    current_fen: "",
    flipped_board: false,
    client_stage: "shop",
    am_i_player: false,
    // SHOP PART
    shop_history: [],
    credit: 800,
    piece_counter: [1, 0, 0, 0, 0, 0, 0],
    //DEPLOY PART
    deploy_history: [],
    deploy_wasm: {},
    //FIGHT PART
    fight_history: [],
    fight_move_history: [],
    fight_wasm: {},
    current_index: 0,
  };
}

export interface ShuuroStore {
  min: number;
  incr: number;
  players: [string, string];
  clocks: [Clock | any, Clock | any];
  hands: [string, string];
  clock_ms: [number, number];
  credits: [number, number];
  current_stage: Stage;
  result: string;
  status: number;
  game_started: string;
  game_id: string;
  rated_game: boolean;
  side_to_move: Color;
  last_clock?: string;
  shop_history?: FenItem[];
  deploy_history?: FenItem[];
  fight_history?: FenItem[];
  fight_move_history?: string[];
  current_fen?: string;
  flipped_board?: boolean;
  blocked_view?: boolean;
  client_stage?: Stage;
  shop_wasm?: ShuuroShop | any;
  deploy_wasm?: ShuuroPosition | any;
  fight_wasm?: any;
  credit?: number;
  piece_counter?: number[];
  am_i_player?: boolean;
  current_index?: number;
  deploy_cground?: Api | any;
  fight_cground?: Api | any;
  player_color?: Color;
  player?: ColorN;

  confirmed_players?: [boolean, boolean];
}

export type Stage = "shop" | "deploy" | "fight";
export type FenItem = [string, number];

export interface ShopItem {
  piece: string;
  price: number;
  toBuy: number;
}

export interface ShopMove {
  sfen: string;
  credit: number;
}

export type Color = "white" | "black";
export type ColorN = 0 | 1;

export const defaultCounter = new Uint8Array([1, 0, 0, 0, 0, 0, 0]);
export const dataMax = new Uint8Array([1, 3, 6, 9, 9, 18, 0]);
export const dataPrice = new Uint8Array([0, 110, 70, 40, 40, 10, 0]);
export const pieces = [
  "k-piece",
  "q-piece",
  "r-piece",
  "b-piece",
  "n-piece",
  "p-piece",
];
