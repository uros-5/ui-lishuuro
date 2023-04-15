import { ref } from "vue";
import { defineStore } from "pinia";
import { Chessground } from "chessground12";
import type { Api } from "chessground12/api";
import type { Color, StageN } from "@/store/game";

export const useCgStore = defineStore("useCgStore", () => {
  const cg = ref(emptyCg());
  return { cg }
});

export function emptyCg(): CgStore {
  let element = new HTMLElement();
  return {
    flipped_board: false,
    client_stage: 0,
    current_index: 0,
    player_color: "none",
    player: 0,
    cg: Chessground(element),
    premoveData: { orig: "", dest: "", active: false },
    am_i_player: false
  }
}

export type CgStore = {
  flipped_board: boolean;
  client_stage: StageN;
  current_index: StageN;
  player_color: Color;
  player: 0 | 1;
  am_i_player: boolean;
  cg: Api;
  premoveData: { orig: string; dest: string; active: boolean };
};
