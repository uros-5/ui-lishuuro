import { defineStore } from "pinia";
import { allowedDuration } from "./useHomeLobby";
import init, { ShuuroShop, ShuuroPosition, test } from "shuuro-wasm";
import { Clock } from "@/plugins/clock";
import Chessground from "@/plugins/chessground";
import { useRouter } from "vue-router";
import router from "@/router";

export const useShuuroStore = defineStore("shuuro", {
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
      white_clock_seconds: { secs: 0, nanos: 0 },
      black_clock_seconds: { secs: 0, nanos: 0 },
    };
  },

  actions: {
    updateClientStage(stage: Stage): void {
      this.$state.client_stage = stage;
    },
    wsHistory(): void {},
    getHistory(): string[] | undefined {
      switch (this.$state.client_stage) {
        case "shop":
          return this.$state.shop_history;
        case "deploy":
          return this.$state.deploy_history;
        case "fight":
          return this.$state.fight_history;
      }
    },
    setBasicData(data: ShuuroStore): void {
      router.push({ path: "/shuuro/shop/1" });
      this.$state.game_id = data.game_id;
      this.$state.min = data.min;
      this.$state.incr = data.incr;
      this.$state.white = data.white;
      this.$state.black = data.black;
      this.$state.side_to_move = data.side_to_move;
      this.$state.current_stage = data.current_stage;
      this.$state.white_clock_seconds = data.white_clock_seconds;
      this.$state.black_clock_seconds = data.black_clock_seconds;
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
    },
    activateClock(): void {
      /*
      this.$state.whiteClock.onTick(this.$state.whiteClock.render_time);
      this.$state.blackClock.onTick(this.$state.blackClock.render_time);
      if (this.$state.status < 0) {
        if (this.$state.stage == "shop") {
          (this.$state.whiteClock as _clock).start();
          (this.$state.blackClock as _clock).start();
        } else {
          if (this.$state.side_to_move == "white") {
            let calc =
              this.$state.whiteClock_seconds!.secs * 1000 +
              this.$state.whiteClock_seconds!.nanos;
            (this.$state.blackClock as _clock).pause(true);
            (this.$state.whiteClock as _clock).start(calc);
          } else if (this.$state.side_to_move == "black") {
            let calc =
              this.$state.blackClock_seconds!.secs * 1000 +
              this.$state.blackClock_seconds!.nanos;
            (this.$state.whiteClock as _clock).pause(true);
            (this.$state.blackClock as _clock).start(calc);
          }
        }
      } else {
        this.$state.am_i_player = false;
      }
    */
    },
    setShop(data: ShopAndPlaceServerData): void {
      this.shop_history = data.history;
    },
    toggleStm(): void {
      if (this.$state.side_to_move == "black") {
        this.$state.side_to_move = "white";
      } else if (this.$state.side_to_move == "white") {
        this.$state.side_to_move = "black";
      }
    },
    setShuuroShop(color: string): void {
      init().then((_exports) => {
        if (this.credit == 800 || color == "n") {
          this.$state.shop_wasm = new ShuuroShop();
          this.$state.shop_history = [];

          this.$state.deploy_wasm = new ShuuroPosition();
          this.$state.fight_wasm = new ShuuroPosition();
          console.log(test());
          //sethand
          //wasmObject.setHand(reponse.hand);
          //credit.value = wasmObject.getCredit(color.value);
        }
      });
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
    getColor(username: string): string {
      if (username == this.$state.white) {
        return "white";
      } else if (username == this.$state.black) {
        return "black";
      }
      return "white";
    },
    buy(p: string, color: string) {
      this.$state.piece_counter = this.$state.shop_wasm.buy(p);
      let new_credit = this.$state.shop_wasm.getCredit(color);
      let counter = this.$state.shop_wasm.get_piece(p);
      if (new_credit < this.$state.credit!) {
        // ws send move to server
        this.$state.shop_history?.push(`+${p} ${counter}`);
        this.$state.current_index = this.$state.shop_history?.length! - 1;
        this.$state.credit! = new_credit;
      }
    },
    confirm(username: string): void {
      if (this.$state.am_i_player && this.$state.current_stage == "shop") {
        this.$state.shop_wasm.confirm(this.getColor(username));
        if (this.$state.shop_wasm.isConfirmed(this.getColor(username))) {
          // ws send send move to server
          this.$state.shop_wasm.free();
        }
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
  shop_history?: string[];
  deploy_history?: string[];
  fight_history?: string[];
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
  piece_counter?: number[];
  am_i_player?: boolean;
  current_index?: number;
  white_clock_seconds?: { secs: number; nanos: number };
  black_clock_seconds?: { secs: number; nanos: number };
  deploy_cground?: typeof Chessground;
  fight_cground?: typeof Chessground;
}

export interface ShopAndPlaceServerData {
  hand: string;
  history: string[];
  clock: string;
  redirect?: string;
  status?: number;
}

export interface FightServerData {
  moveHistory: string[];
  fightHistory: string[];
}

export type Stage = "shop" | "deploy" | "fight";

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
