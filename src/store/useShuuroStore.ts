import { defineStore } from "pinia";
import { allowedDuration } from "./useHomeLobby";
import init, { ShuuroWasm } from "shuuro-wasm";

export const useShuuroStore = defineStore("shuuro", {
  state: (): ShuuroStore => {
    return {
      min: 0,
      incr: 0,
      white: "uros",
      black: "anon",
      stage: "shop",
      ratedGame: false,
      whiteClock: "20:00",
      blackClock: "20:00",
      blackHand: "",
      whiteHand: "",
      gameStarted: "",
      gameId: "1",
      currentFen: "",
      flippedBoard: false,
      result: "*",
      status: -2,
      clientStage: "shop",
      // SHOP PART
      shopHistory: [],
      credit: 800,
      choices: defaultChoices("w"),
      pieceCounter: [1, 0, 0, 0, 0, 0, 0],
      //DEPLOY PART
      deployHistory: [],
      deployWasm: {},
      //FIGHT PART
      fightHistory: [],
      fightMoveHistory: [],
      fightWasm: {},
    };
  },

  actions: {
    updateClientStage(stage: Stage): void {
      this.$state.clientStage = stage;
    },
    wsHistory(): void {
        
    },
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
      this.$state.stage = data.stage;
      this.$state.ratedGame = data.ratedGame;
      this.$state.whiteClock = data.whiteClock;
      this.$state.blackClock = data.blackClock;
      this.$state.gameStarted = data.gameStarted;
      this.$state.result = data.result;
    },
    setShop(data: ShopAndPlaceServerData): void {
      this.shopHistory = data.history;
    },
    setShuuroShop(color: string): void {
      init().then((_exports) => {
        if (this.credit == 800 || color == "n") {
          this.$state.shopWasm = new ShuuroWasm();
          this.$state.choices = defaultChoices(color);
          this.$state.shopHistory = [];
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
        this.$state.whiteClock = "";
        this.$state.blackClock = "";
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
    }
  },
});

export interface ShuuroStore {
  min: typeof allowedDuration[number];
  incr: typeof allowedDuration[number];
  white: string;
  black: string;
  stage: Stage;
  ratedGame: boolean;
  shopHistory?: string[];
  deployHistory?: string[];
  fightHistory?: string[];
  fightMoveHistory?: string[];
  whiteClock: string;
  blackClock: string;
  currentFen?: string;
  blackHand?: string;
  whiteHand?: string;
  gameStarted: string;
  gameId: string;
  flippedBoard?: boolean;
  blockedView?: boolean;
  result: string;
  status: number;
  clientStage?: Stage;
  shopWasm?: ShuuroWasm | any;
  deployWasm: any;
  fightWasm: any;
  choices?: ShopItem[];
  credit?: number;
  pieceCounter?: number[];
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

export function defaultChoices(c: string): ShopItem[] {
  return [
    { piece: `${c}Q`, price: 110, toBuy: 3 },
    { piece: `${c}R`, price: 70, toBuy: 6 },
    { piece: `${c}B`, price: 40, toBuy: 9 },
    { piece: `${c}N`, price: 40, toBuy: 9 },
    { piece: `${c}P`, price: 10, toBuy: 18 },
  ];
}

const defaultCounter = new Uint8Array([1, 0, 0, 0, 0, 0, 0]);
export default defaultCounter;
