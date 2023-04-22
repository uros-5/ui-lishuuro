import { deployCg, fightCg } from "@/plugins/cg";
import type { Api } from "chessground12/api";
import { setCheck } from "chessground12/board";
import { p2 } from "chessground12/configs";
import type { ShuuroPosition } from "shuuro-wasm";
import { ref, watch, type WatchStopHandle } from "vue";
import { useGameStore } from ".";
import { useWasmStore } from "./useWasmStore";
import { readPockets } from "chessground12/pocket";
import type { Key, MoveMetadata, Piece } from "chessground12/types";
import { useAnalyzeStore } from "./useAnalyzeStore";
import { defineStore } from "pinia";

export const useCgStore = defineStore("useCgStore", () => {
  const state = ref(empty());
  const flippedBoard = ref(false);
  const premoveData = ref({
    orig: "",
    dest: "",
    active: false,
  });
  const wasmStore = useWasmStore();
  const analyzeStore = useAnalyzeStore();
  const gameStore = useGameStore();
  console.log(gameStore, analyzeStore, wasmStore);

  let stage = 0;

  return {
    state,
    flippedBoard,
    premoveData,

    newElement(element: null | HTMLElement, id: 0 | 1 | 2) {
      switch (id) {
        case 0:
          state.value.element = element;
          break;
        case 1:
          state.value.top = element;
          break;
        case 2:
          state.value.bot = element;
          break;
      }
    },

    cgWatcher(newstate: State, _oldstate: State) {
      if (newstate.element && gameStore.server()) {
        analyzeStore.state().active ? (stage = 3) : null;
        if (gameStore.clientStage() == 1) {
          if (newstate.top && newstate.bot && stage != 1) {
            stage = 1;
            const cg = deployCg(
              newstate.element,
              gameStore.config(),
              newstate.top,
              newstate.bot,
              gameStore.state.variant
            );
            state.value.cg = cg;
            gameStore.player().player == 1 ? this.flipBoard() : null;
            this.changePocketRoles();
            state.value.cg.redrawAll();
            state.value.cg.state.events.dropNewPiece = this.afterPlace;
          }
        } else if (
          (gameStore.clientStage() == 2 || analyzeStore.state().active) &&
          stage != 2
        ) {
          stage = 2;
          const cg = fightCg(
            newstate.element,
            gameStore.config(),
            gameStore.state.variant
          );
          state.value.cg = cg;
          gameStore.player().player == 1 ? this.flipBoard() : null;
          this.enablePremove();
          state.value.cg.state.events.select = this.selectSq;
          state.value.cg.state.movable.events.after = this.afterMove;
          state.value.cg.redrawAll();
        }
      }
    },

    flipBoard() {
      state.value.cg!.toggleOrientation();
      flippedBoard.value = !flippedBoard.value;
    },

    flipped() {
      return flippedBoard;
    },

    setPieces(cg: Api, sp: ShuuroPosition) {
      const pieces = sp.map_pieces();
      cg.setPieces(pieces);
      cg.state.pieces = pieces;
      cg.state.dom.redraw();
      cg.state.dom.redraw();
    },

    setPlinths(cg: Api, sp: ShuuroPosition, ignore?: boolean) {
      if (ignore == true) return;
      const plinths = sp.map_plinths();
      cg.state.plinths = plinths;
      cg.redrawAll();
    },

    setCheck(cg: Api, check: boolean) {
      setCheck(cg.state, check);
      cg.state.dom.redraw();
    },

    changePocketRoles() {
      if (gameStore.state.variant.endsWith("Fairy")) {
        state.value.cg!.state.pocketRoles = p2;
      }
    },

    setPocket(hand: string | undefined) {
      if (hand == undefined) {
        return;
      }

      state.value.cg!.state.pockets = readPockets(
        `[${hand}]`,
        state.value.cg!.state.pocketRoles!
      );
      state.value.cg!.redrawAll();
    },

    wasmPocket() {
      const hand = wasmStore.placement().count_hand_pieces();
      state.value.cg!.state.pockets = readPockets(
        `[${hand}]`,
        state.value.cg!.state.pocketRoles!
      );
    },

    pocketSelect(piece: Piece) {
      if (!gameStore.canPlay) {
        return;
      }
      const ch = this.shuuroPiece(piece);
      const moves = wasmStore.placement().place_moves(ch);
      this.new_legal_moves(moves);
    },

    shuuroPiece(piece: Piece): string {
      const p =
        piece.color == "white"
          ? piece.role[0].toUpperCase()
          : piece.role[0].toLowerCase();
      return p;
    },

    afterPlace(piece: Piece, key: Key) {
      if (!gameStore.canPlay) {
        return;
      }
    },

    afterMove(orig: Key, dest: Key, _metadata: MoveMetadata) {},

    enablePremove() {
      if (gameStore.player().isPlayer && gameStore.state.status < 1) {
        state.value.cg!.state.premovable.events = {
          set: (orig, dest) => {},
          unset: () => {},
        };
        state.value.cg!.state.premovable.enabled = true;
        state.value.cg!.state.premovable!.events!.set = (orig, dest, _) => {
          premoveData.value.orig = orig;
          premoveData.value.dest = dest;
          premoveData.value.active = true;
        };
        state.value.cg!.state.premovable!.events!.unset! = () => {
          premoveData.value.active = false;
        };
      }
    },

    selectSq(_key: Key) {
      if (gameStore.canPlay()) {
      } else if (analyzeStore.state().active) {
        const dests = state.value.cg!.state.movable.dests;
        if (dests?.size == 0 || dests == undefined) {
          const lm = gameStore.legal_moves();
          this.new_legal_moves(lm);
        }
      }
    },

    new_legal_moves(lm: Map<any, any>) {
      state.value.cg!.state.movable.dests = lm;
    },

    movable_color(color: string) {
      state.value.cg!.state.movable.color = color == "w" ? "white" : "black";
      state.value.cg!.state.turnColor = color == "w" ? "white" : "black";
    },
  };

  // constructor() {
  //   this.watcher = watch(state, (newstate, oldstate, _clean) => {
  //     this.cgWatcher(newstate, oldstate);
  //   });
  // }
});

function empty(): State {
  return {
    cg: undefined,
    element: null,
    top: null,
    bot: null,
    tvCgs: [],
    profileGames: [],
  };
}

type State = {
  cg: Api | undefined;
  element: HTMLElement | null | undefined;
  top: HTMLElement | null | undefined;
  bot: HTMLElement | null | undefined;
  tvCgs: Api[];
  profileGames: Api[];
};

type premoveData = {
  orig: string;
  dest: string;
  active: boolean;
};
