import { defineStore } from "pinia";
import { allowedDuration } from "./useHomeLobby";
import init, { ShuuroShop, ShuuroPosition } from "shuuro-wasm";
import { Clock } from "@/plugins/clock";

export const useShuuroStore = defineStore("shuuro", {
  state: (): ShuuroStore => {
    return {
      min: 5,
      incr: 3,
      white: "uros",
      black: "anon",
      sideToMove: "white",
      stage: "shop",
      ratedGame: false,
      whiteClock: new Clock(5, 3, 0, "1"),
      blackClock: new Clock(5, 3, 0, "0"),
      blackHand: "",
      whiteHand: "",
      gameStarted: "",
      gameId: "1",
      currentFen: "",
      flippedBoard: false,
      result: "*",
      status: -2,
      clientStage: "shop",
      amIPlayer: false,
      // SHOP PART
      shopHistory: [],
      credit: 800,
      pieceCounter: [1, 0, 0, 0, 0, 0, 0],
      //DEPLOY PART
      deployHistory: [],
      deployWasm: {},
      //FIGHT PART
      fightHistory: [],
      fightMoveHistory: [],
      fightWasm: {},
      currentIndex: 0,
      whiteClockSeconds: { secs: 0, nanos: 0 },
      blackClockSeconds: { secs: 0, nanos: 0 },
    };
  },

  actions: {
    updateClientStage(stage: Stage): void {
      this.$state.clientStage = stage;
    },
    wsHistory(): void {},
    getHistory(): string[] | undefined {
      switch (this.$state.clientStage) {
        case "shop":
          return this.$state.shopHistory;
        case "deploy":
          return this.$state.deployHistory;
        case "fight":
          return this.$state.fightHistory;
      }
    },
    setBasicData(data: ShuuroStore): void {
      this.$state.gameId = data.gameId;
      this.$state.min = data.min;
      this.$state.incr = data.incr;
      this.$state.white = data.white;
      this.$state.black = data.black;
      this.$state.sideToMove = data.sideToMove;
      this.$state.stage = data.stage;
      this.$state.ratedGame = data.ratedGame;
      this.$state.whiteClockSeconds = data.whiteClockSeconds;
      this.$state.blackClockSeconds = data.blackClockSeconds;
      this.$state.whiteClock = new Clock(data.min, data.incr, 0, "1");
      this.$state.blackClock = new Clock(data.min, data.incr, 0, "1");
      this.$state.gameStarted = data.gameStarted;
      this.$state.result = data.result;
      this.$state.status = data.status;
    },
    activateClock(): void {/*
      this.$state.whiteClock.onTick(this.$state.whiteClock.renderTime);
      this.$state.blackClock.onTick(this.$state.blackClock.renderTime);
      if (this.$state.status < 0) {
        if (this.$state.stage == "shop") {
          (this.$state.whiteClock as Clock).start();
          (this.$state.blackClock as Clock).start();
        } else {
          if (this.$state.sideToMove == "white") {
            let calc =
              this.$state.whiteClockSeconds!.secs * 1000 +
              this.$state.whiteClockSeconds!.nanos;
            (this.$state.blackClock as Clock).pause(true);
            (this.$state.whiteClock as Clock).start(calc);
          } else if (this.$state.sideToMove == "black") {
            let calc =
              this.$state.blackClockSeconds!.secs * 1000 +
              this.$state.blackClockSeconds!.nanos;
            (this.$state.whiteClock as Clock).pause(true);
            (this.$state.blackClock as Clock).start(calc);
          }
        }
      } else {
        this.$state.amIPlayer = false;
      }
    */
    },
    setShop(data: ShopAndPlaceServerData): void {
      this.shopHistory = data.history;
    },
    toggleStm(): void {
      if (this.$state.sideToMove == "black") {
        this.$state.sideToMove = "white";
      } else if (this.$state.sideToMove == "white") {
        this.$state.sideToMove = "black";
      }
    },
    setShuuroShop(color: string): void {
      init().then((_exports) => {
        if (this.credit == 800 || color == "n") {
          this.$state.shopWasm = new ShuuroShop();
          this.$state.shopHistory = [];

          this.$state.deployWasm = new ShuuroPosition();
          this.$state.fightWasm = new ShuuroPosition();
          //sethand
          //wasmObject.setHand(reponse.hand);
          //credit.value = wasmObject.getCredit(color.value);
        }
      });
    },
    setEmptyState(): void {
      this.$state.min = 0;
      this.$state.incr = 0;
      this.$state.white = "";
      this.$state.black = "";
      this.$state.stage = "shop";
      this.$state.ratedGame = false;
      this.$state.shopHistory = [];
      this.$state.fightHistory = [];
      this.$state.deployHistory = [];
      this.$state.fightMoveHistory = [];
      this.$state.whiteClock = new Clock(0, 0, 0, "1");
      this.$state.blackClock = new Clock(0, 0, 0, "0");
      this.$state.currentFen = "";
      this.$state.blackHand = "";
      this.$state.whiteHand = "";
      this.$state.gameStarted = "";
      this.$state.gameId = "";
      this.$state.flippedBoard = false;
      this.$state.blockedView = false;
      this.$state.result = "";
      this.$state.status = -2;
      this.$state.clientStage = "shop";
      this.$state.credit = 800;
    },
    isThisPlayer(user: string): void {
      this.$state.amIPlayer = [this.$state.black, this.$state.white].includes(
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
      this.$state.pieceCounter = this.$state.shopWasm.buy(p);
      let newCredit = this.$state.shopWasm.getCredit(color);
      let counter = this.$state.shopWasm.get_piece(p);
      if (newCredit < this.$state.credit!) {
        // ws send move to server
        this.$state.shopHistory?.push(`+${p} ${counter}`);
        this.$state.currentIndex = this.$state.shopHistory?.length! - 1;
        this.$state.credit! = newCredit;
      }
    },
    confirm(username: string): void {
      if (this.$state.amIPlayer && this.$state.stage == "shop") {
        this.$state.shopWasm.confirm(this.getColor(username));
        if (this.$state.shopWasm.isConfirmed(this.getColor(username))) {
          // ws send send move to server
          this.$state.shopWasm.free();
        }
      }
    },
    switchClock() {
      console.log("clicked");
      if (this.$state.whiteClock.running) {
        this.$state.whiteClock.pause(true);
        this.$state.blackClock.start();
      } else if (this.$state.blackClock.running) {
        this.$state.blackClock.pause(true);
        this.$state.whiteClock.start();
      }
    },
  },
});

export interface ShuuroStore {
  min: typeof allowedDuration[number];
  incr: typeof allowedDuration[number];
  white: string;
  black: string;
  stage: Stage;
  result: string;
  status: number;
  gameStarted: string;
  gameId: string;
  ratedGame: boolean;
  sideToMove: Color;
  shopHistory?: string[];
  deployHistory?: string[];
  fightHistory?: string[];
  fightMoveHistory?: string[];
  whiteClock?: any | Clock;
  blackClock?: any | Clock;
  currentFen?: string;
  blackHand?: string;
  whiteHand?: string;
  flippedBoard?: boolean;
  blockedView?: boolean;
  clientStage?: Stage;
  shopWasm?: ShuuroShop | any;
  deployWasm?: ShuuroPosition | any;
  fightWasm?: any;
  credit?: number;
  pieceCounter?: number[];
  amIPlayer?: boolean;
  currentIndex?: number;
  whiteClockSeconds?: { secs: number; nanos: number };
  blackClockSeconds?: { secs: number; nanos: number };
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
