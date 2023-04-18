import { deployCg, fightCg } from "@/plugins/cg";
import { Chessground } from "chessground12";
import type { Api } from "chessground12/api";
import { setCheck } from "chessground12/board";
import type { Config } from "chessground12/config";
import { p2 } from "chessground12/configs";
import { defineStore } from "pinia";
import type { ShuuroPosition } from "shuuro-wasm";
import { ref, watch } from "vue";
import { useGameStore } from ".";
import { useWasmStore } from "./useWasmStore";
import { readPockets } from "chessground12/pocket";
import type { Key, Piece } from "chessground12/types";

export const useCgStore = defineStore("useCgStore", () => {
  const state = ref(empty());
  const premoveData = ref(
    {
      orig: "", dest: "", active: false
    });
  const game = useGameStore();
  const wasm = useWasmStore();
  let stage = 0;

  function cgWatcher(newstate: State, _oldstate: State) {
    if (newstate.element && game.server) {
      if (game.state.current_stage == 1) {
        if (newstate.top && newstate.bot && stage != 1) {
          stage = 1;
          const cg = deployCg(newstate.element, game.config, newstate.top, newstate.bot, game.state.variant);
          state.value.cg = cg;
        }
      }
      else if (game.state.current_stage == 2 && stage != 2) {
        stage = 2;
        const cg = fightCg(newstate.element, game.config, game.state.variant);
        state.value.cg = cg;
      }
    }
  };

  let _watcher = watch(state, (newstate, oldstate, _clean) => {
    cgWatcher(newstate, oldstate);
  });

  return new class {
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

    changePocketRoles(config: Config) {
      if (game.state.variant.endsWith("Fairy")) {
        config.pocketRoles = p2;
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

    enablePremove(config: Config) {
      if (game.player.isPlayer && game.state.status < 1) {
        config.premovable = {
          events: { set: (_orig, _dest) => { }, unset: () => { } },
        };
        config.premovable.enabled = true;
        config.premovable!.events!.set = (orig, dest, _) => {
          premoveData.value.orig = orig;
          premoveData.value.dest = dest;
          premoveData.value.active = true;
        };
        config.premovable!.events!.unset! = () => {
          premoveData.value.active = false;
        };
      }
    }

    selectSq(_key: Key) {
      if (game.canPlay) {
      }
      else if (game.analyze.active) {
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