import { ShuuroPosition, ShuuroShop } from "@/plugins/shuuro-wasm";
import init from "@/plugins/shuuro-wasm";
import { ref } from "vue";
import { defineStore } from "pinia";
import { useGameStore } from "@/store/game";
import type { Piece } from "chessground12/types";

export const useWasmStore = defineStore("useWasmStore", () => {
  const state = ref(empty());
  const gameStore = useGameStore();

  return {
    state,
    async init() {
      let i = await init();
      state.value.wasm[0] = new ShuuroShop();
      state.value.wasm[1] = new ShuuroPosition("shuuro");
      state.value.wasm[2] = new ShuuroPosition("shuuro");
      state.value.analyzeWasm = new ShuuroPosition("shuuro");
      state.value.init = true;
    },

    changeVariant(variant: string) {
      [0, 1, 2].forEach((item) =>
        state.value.wasm[item]!.change_variant(variant)
      );
    },

    shop(): ShuuroShop {
      return state.value.wasm[0]!;
    },

    placement(): ShuuroPosition {
      return state.value.wasm[1]!;
    },

    fight(): ShuuroPosition {
      return state.value.wasm[2]!;
    },

    analyze(): ShuuroPosition {
      return state.value.analyzeWasm!;
    },

    current(): ShuuroPosition | undefined {
      return state.value.wasm[gameStore.clientStage() as 1]
    },

    wasmPiece(piece: Piece): string {
      const p =
        piece.color == "white"
          ? piece.role[0].toUpperCase()
          : piece.role[0].toLowerCase();
      return p;
    },

    stm(): string {
      return this.current()!.side_to_move() == "w" ? "white" : "black";
    },

    legal_moves(piece?: Piece, side?: 0 | 1) {
      const wasm = this.current()!;
      let lm;
      if (piece) {
        const shuuroPiece = this.wasmPiece(piece);
        lm = wasm.place_moves(shuuroPiece);
      }
      else if(side) {
        const color = this.color(side);
        lm = wasm.legal_moves(color);
      }
      else {
        lm = new Map();
      }
      return lm;
    },

    color(side: 0 | 1): string {
      return side == 0 ? "w" : "b";
    },

    reset() {
      state.value = empty();
    }
  };
});

type WasmStore = {
  wasm: [
    ShuuroShop | undefined,
    ShuuroPosition | undefined,
    ShuuroPosition | undefined
  ];
  analyzeWasm: ShuuroPosition | undefined;
  init: boolean;
};

function empty(): WasmStore {
  return {
    wasm: [undefined, undefined, undefined],
    analyzeWasm: undefined,
    init: false
  }
}
