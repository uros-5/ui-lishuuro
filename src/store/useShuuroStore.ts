import { defineStore } from "pinia";
import init, { ShuuroShop, ShuuroPosition } from "shuuro-wasm";
import { Clock } from "@/plugins/clock";
import Chessground from "@/plugins/chessground";
import router from "@/router";
import { ServerDate } from "@/plugins/serverDate";
import { ws, SEND } from "@/plugins/webSockets";
import { anonConfig, liveConfig } from "@/plugins/chessground/configs";
import { Api } from "@/plugins/chessground/api";

export const useShuuroStore2 = defineStore("shuuro", {
  state: (): ShuuroStore => {
    return {
      min: [5 * 60, 0],
      incr: [3, 0],
      white: "uros",
      black: "anon",
      side_to_move: "white",
      current_stage: "shop",
      rated_game: false,
      white_clock: new Clock(5, 3, 0, "1"),
      black_clock: new Clock(5, 3, 0, "0"),
      black_hand: "",
      white_hand: "",
      game_started: "",
      game_id: "1",
      current_fen: "",
      flipped_board: false,
      result: "*",
      status: -2,
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
      white_clock_ms: 0,
      black_clock_ms: 0,
      player_color: "white",
    };
  },

  actions: {
    updateClientStage(stage: Stage): void {
      this.$state.client_stage = stage;
    },
    wsHistory(): void {
    },
    getHistory(): FenItem[] | undefined {
      switch (this.$state.client_stage) {
        case "shop":
          return this.$state.shop_history;
        case "deploy":
          return this.$state.deploy_history;
        case "fight":
          return this.$state.fight_history;
      }
    },
    setBasicData(data: ShuuroStore, user: string): void {
      router.push({ path: `/shuuro/shop/${data.game_id}` });
      this.$state.game_id = data.game_id;
      this.$state.min = data.min;
      this.$state.incr = data.incr;
      this.$state.white = data.white;
      this.$state.black = data.black;
      this.$state.side_to_move = data.side_to_move;
      this.$state.current_stage = data.current_stage;
      this.$state.white_clock_ms = data.white_clock;
      this.$state.black_clock_ms = data.black_clock;
      this.$state.white_clock = new Clock(
        data.min[0] / 60,
        data.incr[0],
        0,
        "1"
      );
      this.$state.black_clock = new Clock(
        data.min[0] / 60,
        data.incr[0],
        0,
        "1"
      );
      //this.$state.game_started = data.game_started;
      this.$state.result = data.result;
      this.$state.status = data.status;
      this.$state.last_clock = data.last_clock;
      this.$state.shop_history = data.shop_history;
      this.isThisPlayer(user);
      this.$state.player_color = this.getColor(user);
      this.getServerCredit(data);
      this.$state.flipped_board =
        this.$state.player_color == "black" ? true : false;
      this.activateClock();
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
    activateClock(): void {
      this.$state.white_clock.onTick(this.$state.white_clock.renderTime);
      this.$state.black_clock.onTick(this.$state.black_clock.renderTime);
      if (this.$state.status < 0) {
        if (this.$state.current_stage == "shop") {
          this.shopDuration();
          (this.$state.white_clock as Clock).start(this.$state.white_clock_ms);
          (this.$state.black_clock as Clock).start(this.$state.black_clock_ms);
        } else {
          if (this.$state.side_to_move == "white") {
            (this.$state.black_clock as Clock).pause(true);
            (this.$state.white_clock as Clock).start(
              this.$state.white_clock_ms
            );
          } else if (this.$state.side_to_move == "black") {
            (this.$state.white_clock as Clock).pause(true);
            (this.$state.black_clock as Clock).start(
              this.$state.black_clock_ms
            );
          }
        }
      } else {
        this.$state.am_i_player = false;
      }
    },
    setShop(data: ShopAndPlaceServerData): void {
      this.shop_history = data.history;
    },
    setConfirmed(data: [boolean, boolean]) {
      this.$state.confirmed_players = data;
      if (this.amIConfirmed()) {
        let ms =
          this.player_color == "white"
            ? this.$state.white_clock_ms
            : this.$state.black_clock_ms;
        let clock =
          this.player_color == "white"
            ? this.$state.white_clock
            : this.$state.black_clock;
        (clock as Clock).pause(true);
        (clock as Clock).setTime(ms!);
      }
    },
    toggleStm(): void {
      if (this.$state.side_to_move == "black") {
        this.$state.side_to_move = "white";
      } else if (this.$state.side_to_move == "white") {
        this.$state.side_to_move = "black";
      }
    },
    setShuuroShop(color: string): void {
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
    getServerCredit(data: ShuuroStore) {
      if (this.$state.player_color == "white") {
        this.$state.credit = data.white_credit;
      } else if (this.$state.player_color == "black") {
        this.$state.credit = data.black_credit;
      }
    },
    setEmptyState(): void {
      this.$state.min = [0, 0];
      this.$state.incr = [0, 0];
      this.$state.white = "";
      this.$state.black = "";
      this.$state.current_stage = "shop";
      this.$state.rated_game = false;
      this.$state.shop_history = [];
      this.$state.fight_history = [];
      this.$state.deploy_history = [];
      this.$state.fight_move_history = [];
      this.$state.white_clock = new Clock(0, 0, 0, "1");
      this.$state.black_clock = new Clock(0, 0, 0, "0");
      this.$state.current_fen = "";
      this.$state.black_hand = "";
      this.$state.white_hand = "";
      this.$state.game_started = "";
      this.$state.game_id = "";
      this.$state.flipped_board = false;
      this.$state.blocked_view = false;
      this.$state.result = "";
      this.$state.status = -2;
      this.$state.client_stage = "shop";
      this.$state.credit = 800;
    },
    isThisPlayer(user: string): void {
      this.$state.am_i_player = [this.$state.black, this.$state.white].includes(
        user
      );
    },
    getColor(username: string): Color {
      if (username == this.$state.white) {
        return "white";
      } else if (username == this.$state.black) {
        return "black";
      }
      return "white";
    },
    buy(p: string, color: string) {
      this.$state.piece_counter = this.$state.shop_wasm.buy(p);
      const new_credit = this.$state.shop_wasm.getCredit(color);
      const counter = this.$state.shop_wasm.get_piece(p);
      if (new_credit < this.$state.credit! && !this.amIConfirmed()) {
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
    confirm(username: string): void {
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
          this.stop(this.$state.player_color);
          // ws send send move to server
          //this.$state.shop_wasm.free();
        }
      }
    },
    redirect(path: string) {
      if (path != undefined) {
        router.push({ path: path });
      }
    },
    switchClock() {
      if (this.$state.white_clock.running) {
        this.$state.white_clock.pause(true);
        this.$state.black_clock.start();
      } else if (this.$state.black_clock.running) {
        this.$state.black_clock.pause(true);
        this.$state.white_clock.start();
      }
    },
    shopDuration(): void {
      if (this.$state.current_stage != "shop") return;
      const now = new Date();
      const converted_date = ServerDate(this.$state.last_clock!);
      const elapsed = now.getTime() - converted_date.getTime();
      if (this.amIConfirmed()) {
      }
      // am completed then stop
      this.$state.white_clock_ms! -= elapsed;
      this.$state.black_clock_ms! -= elapsed;
    },
    setDeployCg(element: HTMLElement) {
      const config = this.$state.am_i_player ? liveConfig : anonConfig;
      this.$state.deploy_cground = Chessground(element!, config) as Api;
    },
    setFightCg(element: HTMLElement) {
      const config = this.$state.am_i_player ? liveConfig : anonConfig;
      this.$state.fight_cground = Chessground(element!, config) as Api;
    },

    deployCground(): Api {
      return this.$state.deploy_cground as Api;
    },
    fightCground(): Api {
      return this.$state.fight_cground as Api;
    },
    stop(color: string): void {
      if (color == "white") {
        (this.$state.white_clock as Clock).pause(true);
      } else {
        (this.$state.black_clock as Clock).pause(true);
      }
    },
    amIConfirmed(): boolean {
      let index = this.$state.player_color == "white" ? 0 : 1;
      return this.$state.confirmed_players![index];
    },
    myClock(): Clock {
      if (this.$state.player_color == "white") {
        return this.$state.white_clock as Clock;
      } else {
        return this.$state.black_clock as Clock;
      }
    },
    //getClock()
  },
});

export interface ShuuroStore {
  min: [number, number];
  incr: [number, number];
  white: string;
  black: string;
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
  white_clock?: any | Clock;
  black_clock?: any | Clock;
  current_fen?: string;
  black_hand?: string;
  white_hand?: string;
  flipped_board?: boolean;
  blocked_view?: boolean;
  client_stage?: Stage;
  shop_wasm?: ShuuroShop | any;
  deploy_wasm?: ShuuroPosition | any;
  fight_wasm?: any;
  credit?: number;
  white_credit?: number;
  black_credit?: number;
  piece_counter?: number[];
  am_i_player?: boolean;
  current_index?: number;
  white_clock_ms?: number;
  black_clock_ms?: number;
  deploy_cground?: Api | any;
  fight_cground?: Api | any;
  player_color: Color;
  confirmed_players?: [boolean, boolean];
}

export interface ShopAndPlaceServerData {
  hand: string;
  history: FenItem[];
  clock: string;
  redirect?: string;
  status?: number;
}

export interface FightServerData {
  moveHistory: string[];
  fightHistory: FenItem[];
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
