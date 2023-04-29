import { ShuuroPosition, ShuuroShop } from "@/plugins/shuuro-wasm";
import init from "@/plugins/shuuro-wasm";
import { ref } from "vue";
import { defineStore } from "pinia";
import { useGameStore } from "@/store/game";
import type { Piece } from "chessground12/types";
import { useCgStore } from "./useCgStore";
import { useClockStore } from "./useClockStore";

export const useWasmStore = defineStore("useWasmStore", () => {
  const state = ref(empty());
  const gameStore = useGameStore();
  const cgStore = useCgStore();
  const clockStore = useClockStore();

  return {
    state,
    async init() {
      await init();
      const variant = gameStore.state.variant;
      state.value.shop = new ShuuroShop();
      state.value.position = new ShuuroPosition(variant);
      state.value.init = true;
      this.changeVariant()
    },

    changeVariant(variant?: string) {
      variant = variant ? variant : gameStore.state.variant;
      ["shop", "position"].forEach((item) =>
        state.value[item as "shop" | "position"]!.change_variant(variant!)
      );
    },

    shop(): ShuuroShop {
      return state.value.shop!;
    },

    analyze(): ShuuroPosition {
      return state.value.position!;
    },

    current(): ShuuroPosition | undefined {
      return state.value.position;
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
      } else if (side) {
        const color = this.color(side);
        lm = wasm.legal_moves(color);
      } else {
        lm = new Map();
      }
      return lm;
    },

    color(side: 0 | 1): string {
      return side == 0 ? "w" : "b";
    },

    wasmPlace(gameMove: string, isServer: boolean) {
      const placed = this.current()!.place(gameMove);
      if (placed) {
        this.addWasmMove(1);
        this.wasmStm(1);
        if (isServer) {
        }
        cgStore.setCheck();
      }
    },

    addWasmMove(stage: 1 | 2) {
      const wasm = this.current()!;
      const last_move = wasm.last_move();
      gameStore.addMove(stage, last_move);
      gameStore.scrollToBottom();
      gameStore.lastMoveIndex(stage);
      stage == 1 ? cgStore.readPocket() : null;
      gameStore.state.sfen = wasm.generate_sfen();
      gameStore.audio("move");
    },

    wasmStm(stage: 1 | 2) {
      const wasm = this.current();
      clockStore.pause(gameStore.state.side_to_move);
      cgStore.setPieces(cgStore.cg()!, wasm);
      cgStore.setTurnColor();
      clockStore.switchClock();
    },
    
    reset() {
      state.value = empty();
    },
  };
});

type WasmStore = {
  shop: ShuuroShop | undefined;
  position: ShuuroPosition | undefined;
  init: boolean;
};

function empty(): WasmStore {
  return {
    shop: undefined,
    position: undefined,
    init: false,
  };
}
