import { Clock } from "@/plugins/clock";
import type { GameInfo } from "@/plugins/webSocketTypes";
import { Chessground } from "chessground12";
import type { Api } from "chessground12/api";
import { defineStore } from "pinia";
import { ShuuroPosition, ShuuroShop } from "shuuro-wasm";
import init from "shuuro-wasm";
import { ref } from "vue";

export const useGameStore = defineStore("useGameStore", () => {
  const game = ref(emptyGame());
  const watchCount = ref(0);
  const amIPlayer = ref(false);
  const offeredDraw = ref(false);
  const wasm = useWasmStore();
  const cg = useCgStore();
  const analyze = useAnalyzeStore();
  const shop = useShopStore();
  return { game }
});

export const useWasmStore = defineStore("useWasmStore", async () => {
  const wasm = ref(await emptyWasm())
  return { wasm }
});

export const useCgStore = defineStore("useCgStore", () => {
  const cg = ref(emptyCg());
  return { cg }
});

export const useAnalyzeStore = defineStore("useAnalyzeStore", () => {
  const analyze = ref(emptyAnalyze());
  return {analyze};
});

export const useShopStore = defineStore("useShopStore", () => {
  const shop = ref(emptyShop());
  return {shop}
});

function emptyGame(): GameInfo {
  return {
    _id: "",
    min: 0,
    incr: 0,
    players: ["", ""],
    status: 0,
    side_to_move: 0,
    last_clock: { '$date': { "$numberLong": "" } },
    current_stage: 0,
    result: "",
    variant: "",
    credits: [800, 800],
    hands: ["", ""],
    sfen: "",
    history: [[], [], []],
    tc: {
      last_click: "",
      clocks: [0, 0]
    },
    sub_variant: 100
  }
}

export function emptyClock(): [Clock, Clock] {
  return [new Clock(0, 0, 0, "1"), new Clock(0, 0, 0, "2")]
}

export function emptyCg(): CgStore {
  let element = new HTMLElement();
  return {
    flipped_board: false,
    client_stage: 0,
    current_index: 0,
    player_color: "none",
    player: 0,
    cg: Chessground(element),
    premoveData: { orig: "", dest: "", active: false }
  }
}


export type CgStore = {
  flipped_board: boolean;
  client_stage: StageN;
  current_index: StageN;
  player_color: Color;
  player: 0 | 1;
  cg: Api;
  premoveData: { orig: string; dest: string; active: boolean };
};

export type BoardWasm = [ShuuroShop, ShuuroPosition, ShuuroPosition];
export type WasmStore = {
  init: boolean;
  wasm: BoardWasm | undefined;
};

export type AnalyzeStore = {
  analyze: boolean;
  analysisMoves: string[];
  analyzeIndex: number;
};

async function emptyWasm(): Promise<WasmStore> {
  const output = await init();
  if (output) {
    const shop = new ShuuroShop();
    const placement = new ShuuroPosition("shuuro");
    const fight = new ShuuroPosition("shuuro");
    return {
      init: true,
      wasm: [shop, placement, fight]
    }
  }
  else {
    return {
      init: false,
      wasm: undefined
    }
  }
}

export function emptyShop(): ShopStore {
  return {credit: 800, piece_counter: new Uint8Array(10), confirmed_players: [false, false]}
 }

export type ShopStore = {
  credit: number;
  piece_counter: Uint8Array;
  confirmed_players?: [boolean, boolean];
  }

export function emptyAnalyze(): AnalyzeStore {
  return {
    analyze: false,
    analyzeIndex: 0,
    analysisMoves: []
  }
}

export type Stage = "shop" | "deploy" | "fight";
export type StageN = 0 | 1 | 2;
export type Color = "white" | "black" | "none";
