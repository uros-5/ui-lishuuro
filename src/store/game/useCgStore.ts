import { deployCg, fightCg } from "@/plugins/cg";
import { Chessground } from "chessground12";
import type { Api } from "chessground12/api";
import { setCheck } from "chessground12/board";
import type { Config } from "chessground12/config";
import { p2 } from "chessground12/configs";
import { defineStore } from "pinia";
import type { ShuuroPosition } from "shuuro-wasm";
import { ref, watch, type WatchStopHandle } from "vue";
import { useGameStore } from ".";
import { useWasmStore } from "./useWasmStore";
import { readPockets } from "chessground12/pocket";
import type { Key, MoveMetadata, Piece } from "chessground12/types";
import { useAnalyzeStore } from "./useAnalyzeStore";

export const useCgStore = defineStore("useCgStore", () => {
  const state = ref(empty());
  const premoveData = ref(
    {
      orig: "", dest: "", active: false
    });
  const game = useGameStore();
  const wasm = useWasmStore();
  const analyze = useAnalyzeStore();

  let stage = 0;

  return new class {
    watcher: WatchStopHandle;

    constructor() {
      this.watcher = watch(state, (newstate, oldstate, _clean) => {
        this.cgWatcher(newstate, oldstate);
      });
    }

    cgWatcher(newstate: State, _oldstate: State) {
      if (newstate.element && game.server) {
        if (game.clientStage == 1) {
          if (newstate.top && newstate.bot && stage != 1) {
            stage = 1;
            const cg = deployCg(newstate.element, game.config, newstate.top, newstate.bot, game.state.variant);
            state.value.cg = cg;
            game.player.player == 1 ? this.flipBoard() : null;
            this.changePocketRoles();
            state.value.cg.redrawAll();
            state.value.cg.state.events.dropNewPiece = this.afterPlace;
          }
        }
        else if ((game.clientStage == 2 || analyze.state.active) && stage != 2) {
          stage = analyze.state.active ? 3 : 2;
          const cg = fightCg(newstate.element, game.config, game.state.variant);
          state.value.cg = cg;
          game.player.player == 1 ? this.flipBoard() : null;
          this.enablePremove();
          state.value.cg.state.events.select = this.selectSq;
          state.value.cg.state.movable.events.after = this.afterMove;
          state.value.cg.redrawAll()
        }
      }
    }

    flipBoard() {
      state.value.cg.toggleOrientation()
    }

    setPieces(cg: Api, sp: ShuuroPosition) {
      const pieces = sp.map_pieces();
      cg.setPieces(pieces);
      cg.state.pieces = pieces;
      cg.state.dom.redraw();
      cg.state.dom.redraw();
    }

    setPlinths(cg: Api, sp: ShuuroPosition, ignore?: boolean) {
      if (ignore == true) return;
      const plinths = sp.map_plinths();
      cg.state.plinths = plinths;
      cg.redrawAll();
    }

    setCheck(cg: Api, check: boolean) {
      setCheck(cg.state, check);
      cg.state.dom.redraw()
    }

    changePocketRoles() {
      if (game.state.variant.endsWith("Fairy")) {
        state.value.cg.state.pocketRoles = p2;
      }
    }

    setPocket(hand: string | undefined) {
      if (hand == undefined) {
        return;
      }

      state.value.cg.state.pockets = readPockets(
        `[${hand}]`,
        state.value.cg.state.pocketRoles!
      );
      state.value.cg.redrawAll();
    }

    wasmPocket() {
      const hand = wasm.placement().count_hand_pieces();
      state.value.cg.state.pockets = readPockets(
        `[${hand}]`,
        state.value.cg.state.pocketRoles!
      );
    }

    pocketSelect(piece: Piece) {
      if (!game.canPlay) {
        return;
      }
      const ch = this.shuuroPiece(piece);
      const moves = wasm.placement().place_moves(ch);
      this.legal_moves = moves;
    }


    shuuroPiece(piece: Piece): string {
      const p =
        piece.color == "white"
          ? piece.role[0].toUpperCase()
          : piece.role[0].toLowerCase();
      return p;
    }

    afterPlace(piece: Piece, key: Key) {
      if (!game.canPlay) {
        return;
      }
    }


    afterMove(orig: Key, dest: Key, _metadata: MoveMetadata) {

    }


    enablePremove() {
      if (game.player.isPlayer && game.state.status < 1) {
        state.value.cg.state.premovable.events = {
          set: (orig, dest) => { },
          unset: () => { }
        };
        state.value.cg.state.premovable.enabled = true;
        state.value.cg.state.premovable!.events!.set = (orig, dest, _) => {
          premoveData.value.orig = orig;
          premoveData.value.dest = dest;
          premoveData.value.active = true;
        };
        state.value.cg.state.premovable!.events!.unset! = () => {
          premoveData.value.active = false;
        };
      }
    }

    selectSq(_key: Key) {
      if (game.canPlay) {
      }
      else if (analyze.state.active) {
        let dests = state.value.cg.state.movable.dests;
        if (dests?.size == 0 || dests == undefined) {
          const lm = game.legal_moves();
          this.legal_moves = lm;
        }
      }
    }

    set legal_moves(lm: Map<any, any>) {
      state.value.cg.state.movable.dests = lm;
    }

    set movable_color(color: string) {
      state.value.cg.state.movable.color = color == "w" ? "white" : "black"
      state.value.cg.state.turnColor = color == "w" ? "white" : "black"
    }

  }
})

function empty(): State {
  const element = new HTMLElement();
  return {
    cg: Chessground(element),
    element: null,
    top: null,
    bot: null,
    tvCgs: [],
    profileGames: []
  }
}

type State = {
  cg: Api,
  element: HTMLElement | null | undefined,
  top: HTMLElement | null | undefined,
  bot: HTMLElement | null | undefined,
  tvCgs: Api[],
  profileGames: Api[]
}

type premoveData = {
  orig: string; dest: string; active: boolean
}