import type { GameInfo } from "@/plugins/webSocketTypes";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useWs } from "../useWs";
import { useAnalyzeStore } from "./useAnalyzeStore";
import { useCgStore } from "./useCgStore";
import { useShopStore } from "./useShopStore";
import { useWasmStore } from "./useWasmStore";

export type Stage = "shop" | "deploy" | "fight";
export type StageN = 0 | 1 | 2;
export type Color = "white" | "black" | "none";

export const useGameStore = defineStore("useGameStore", () => {
  const game = ref(emptyGame());
  const watchCount = ref(0);
  const amIPlayer = ref(false);
  const offeredDraw = ref(false);
  const wasm = useWasmStore();
  const cg = useCgStore();
  const analyze = useAnalyzeStore();
  const shop = useShopStore();
  const { SEND } = useWs();

  const $reset = () => game.value = emptyGame();
  const send = (t: string, game_move?: string) => {
    if (analyze.analyze) return;
    let msg = { game_id: game.value._id, variant: game.value.variant, t, game_move };
    SEND(msg);
  };


  return { game, send, $reset }
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
