import { deployCg, fightCg } from "@/plugins/cg";
import type { Api } from "chessground12/api";
import { setCheck } from "chessground12/board";
import { p2 } from "chessground12/configs";
import type { ShuuroPosition } from "@/plugins/shuuro-wasm";
import { ref, watch, type WatchStopHandle } from "vue";
import { useGameStore } from "@/store/game";
import { useWasmStore } from "@/store/game/useWasmStore";
import { readPockets } from "chessground12/pocket";
import type { Key, MoveMetadata, Piece } from "chessground12/types";
import { useAnalyzeStore } from "@/store/game/useAnalyzeStore";
import { defineStore } from "pinia";
import { useClockStore } from "@/store/game/useClockStore";
import { playAudio } from "@/plugins/audio";
import { FenBtn } from "@/plugins/fen";

export const useCgStore = defineStore("useCgStore", () => {
  const state = ref(empty());
  const others = ref(emptyOthers());
  const wasmStore = useWasmStore();
  const analyzeStore = useAnalyzeStore();
  const gameStore = useGameStore();
  const clockStore = useClockStore();
  let watcher: WatchStopHandle;
  return {
    state,
    others,
    cg(): Api | undefined {
      return state.value.cg
    },
    isElementLoaded(): boolean {
      return state.value.element && gameStore.loaded() ? true : false;
    },
    isPocketReady(): boolean {
      return state.value.top && state.value.bot ? true : false;
    },
    isCurrentStage(stage: number): boolean {
      return others.value.stage != stage;
    },
    newElement(element: undefined | HTMLElement, id: 0 | 1 | 2) {
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

    watch() {
      let self = this;
      watcher = watch(state, (n, o) => {
        self.cgWatcher(n, o)
      }, { deep: true });
    },

    cgWatcher(newstate: State, _oldstate: State) {
      if (newstate.element && gameStore.loaded()) {
        // console.log(newstate.element, others.value.stage, gameStore.clientStage())
        analyzeStore.state().active ? (others.value.stage = 3) : null;
        if (gameStore.clientStage() == 1) {
          if (newstate.top && newstate.bot && others.value.stage != 1) {
            others.value.stage = 1;
            const cg = deployCg(
              newstate.element,
              gameStore.config(),
              newstate.top,
              newstate.bot,
              gameStore.state.variant
            );
            state.value.cg = cg;
            gameStore.player().player == 1 ? this.flipBoard(false) : null;
            this.changePocketRoles();
            cg.state.events.pocketSelect = this.pocketSelect;
            cg.state.events.dropNewPiece = this.afterPlace;
            cg.state.movable.color = gameStore.playerColor() as "white";
            const placement = wasmStore.placement();
            if (placement) {
              gameStore.setSfen(placement)
            }
          }
        } else if (
          (gameStore.clientStage() == 2 || analyzeStore.state().active) &&
          others.value.stage != 2
        ) {
          others.value.stage = 2;
          const cg = fightCg(
            newstate.element,
            gameStore.config(),
            gameStore.state.variant
          );
          state.value.cg = cg;
          gameStore.player().player == 1 ? this.flipBoard(false) : null;
          this.enablePremove();
          state.value.cg.state.events.select = this.selectSq;
          state.value.cg.state.movable.events.after = this.afterMove;
          cg.state.movable.color = gameStore.playerColor() as "white";
          const fight = wasmStore.fight();
          if (fight) {
            gameStore.setSfen(fight)
          }
        }
      }
    },

    flipBoard(force = true) {
      const shop = gameStore.state.current_stage == 0 || gameStore.other.clientStage == 0;
      !shop ? state.value.cg?.toggleOrientation() : null;
      if (force) {
        others.value.flippedBoard = !others.value.flippedBoard;
      }
    },

    flipped() {
      return others.value.flippedBoard;
    },

    setPieces(cg: Api, sp: ShuuroPosition, force = true) {
      const pieces = sp.map_pieces();
      cg.setPieces(pieces);
      if (force) {
        cg.state.pieces = pieces;
        cg.state.dom.redraw();
        cg.state.dom.redraw();
      }
    },

    setPlinths(cg: Api, sp: ShuuroPosition, ignore?: boolean) {
      if (ignore == true) return;
      const plinths = sp.map_plinths();
      cg.setPlinths(plinths)
      cg.state.plinths = plinths;
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

    readPocket(position: ShuuroPosition) {
      const hand = position.count_hand_pieces();
      state.value.cg!.state.pockets = readPockets(
        `[${hand}]`,
        state.value.cg!.state.pocketRoles!
      );
    },

    setPocket(hand: string | undefined) {
      if (hand == undefined) {
        return;
      }

      state.value.cg!.state.pockets = readPockets(
        `[${hand}]`,
        state.value.cg!.state.pocketRoles!
      );
      state.value.cg!.state.dom.redraw();
    },

    wasmPocket(force?: boolean) {
      const hand = wasmStore.placement().count_hand_pieces();
      state.value.cg?.wasmPlinthLoad
      state.value.cg!.state.pockets = readPockets(
        `[${hand}]`,
        state.value.cg!.state.pocketRoles!
      );
      if (force) {
        state.value.cg!.state.dom.redrawNow()
        state.value.cg!.redrawAll();

      }
    },

    pocketSelect(piece: Piece) {
      if (!gameStore.canPlay()) {
        return;
      }
      else if (gameStore.other.index == gameStore.history().length - 1) {
        const ch = this.shuuroPiece(piece);
        const moves = wasmStore.placement().place_moves(ch);
        this.new_legal_moves(moves);

      }
    },

    shuuroPiece(piece: Piece): string {
      const p =
        piece.color == "white"
          ? piece.role[0].toUpperCase()
          : piece.role[0].toLowerCase();
      return p;
    },

    afterPlace(piece: Piece, key: Key) {
      if (!gameStore.canPlay()) {
        return;
      }
      const p = this.shuuroPiece(piece);
      const gameMove = `${p}@${key}`;
      gameStore.send("live_game_place", gameMove)
      this.wasmPlace(gameMove, false);
    },

    wasmPlace(gameMove: string, isServer: boolean) {
      const placed = wasmStore.placement().place(gameMove);
      if (placed) {
        this.addWasmMove(1);
        this.wasmStm(1)
        if (isServer) {
        }
        this.setCheck2(1);
      }
    },

    wasmMove(game_move: string, is_server: boolean) {
      const wasm = wasmStore.fight();
      const beforeCount = wasm.pieces_count();
      const played = wasm.make_move(game_move);
      if (!played.toLowerCase().startsWith("illegal")) {
        const lastMove = wasm.last_move();
        const move = game_move.split("_");
        const newCount = wasm.pieces_count();
        if (is_server) {
          state.value.cg!.move(move[0] as Key, move[1] as Key);
          if (newCount != beforeCount) {
            playAudio("capture");
          } else {
            playAudio("move");
          }
          if (lastMove.includes("=")) {
            this.setPieces(state.value.cg!, wasm);
          }
        }
        if (lastMove.includes("=")) {
          this.setPieces(state.value.cg!, wasm);
        }
        this.setTurnColor();
        this.setCheck2(gameStore.state.current_stage as 1);
        clockStore.switchClock();
        if (!analyzeStore.state().active) gameStore.addMove(gameStore.state.current_stage as 0, lastMove)
        gameStore.scrollToBottom();
        gameStore.lastMoveIndex(gameStore.state.current_stage)
        state.value.cg!.state.dom.redraw();
        const lm = gameStore.legal_moves()
        this.new_legal_moves(lm)
        this.playPremove();
      } else {
      }
    },

    playPremove() {
      if (others.value.premoveData.active && gameStore.canPlay()) {
        state.value.cg!.playPremove();
        others.value.premoveData.active = false;
      }
    },


    sendMove(s: string) {
      if (!analyzeStore.state().active) {
        gameStore.send("live_game_play", s);
      }
    },

    addWasmMove(stage: 1 | 2) {
      const wasm = stage == 1 ? wasmStore.placement() : wasmStore.fight();
      const last_move = wasm.last_move();
      gameStore.addMove(stage, last_move);
      gameStore.scrollToBottom();
      gameStore.lastMoveIndex(stage)
      stage == 1 ? this.wasmPocket() : null;
      gameStore.state.sfen = wasm.generate_sfen();
      playAudio("move");
    },

    wasmStm(stage: 1 | 2) {
      const wasm = stage == 1 ? wasmStore.placement() : wasmStore.fight();
      clockStore.pause(gameStore.state.side_to_move);
      this.setPieces(state.value.cg!, wasm);
      this.setTurnColor();
      clockStore.switchClock();
    },

    setCheck2(stage: 1 | 2) {
      const wasm = stage == 1 ? wasmStore.placement() : wasmStore.fight();
      const is_check = wasm.is_check();
      setCheck(state.value.cg!.state, is_check);
    },

    afterMove(orig: Key, dest: Key, _metadata: MoveMetadata) {
      const gameMove = `${orig}_${dest}`;
      this.wasmMove(gameMove, false)
      this.sendMove(gameMove);
      playAudio("move");
      if (_metadata.captured!) {
        playAudio("capture");
      }
    },

    enablePremove() {
      if (gameStore.player().isPlayer && gameStore.state.status < 1) {
        state.value.cg!.state.premovable.events = {
          set: (orig, dest) => { },
          unset: () => { },
        };
        state.value.cg!.state.premovable.enabled = true;
        state.value.cg!.state.premovable!.events!.set = (orig, dest, _) => {
          others.value.premoveData.orig = orig;
          others.value.premoveData.dest = dest;
          others.value.premoveData.active = true;
        };
        state.value.cg!.state.premovable!.events!.unset! = () => {
          others.value.premoveData.active = false;
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

    setMovable(movable: boolean) {
      state.value.cg!.state.movable.showDests = movable;
      state.value.cg!.state.draggable.enabled = movable;
      state.value.cg!.state.movable.color =
        analyzeStore.state().active ? "both" :
          gameStore.playerColor() as "white";
    },

    setDraggable(draggable: boolean) {
      // if ()
      state.value.cg!.state.draggable.enabled = draggable;
      state.value.cg!.state.dropmode.active = draggable;
    },

    enableMovable(fenBtn: FenBtn) {
      const enable = (value: boolean) => {
        this.setMovable(value)
        this.setDraggable(value);
      };
      if (analyzeStore.state().active) {
        enable(true);
      }
      const checks = [fenBtn == FenBtn.Last,
      gameStore.state.status < 0,
      gameStore.player().isPlayer,
      gameStore.state.current_stage == gameStore.clientStage()];
      !checks.includes(false) ? enable(true) : enable(false);
    },

    setTurnColor(turnColor?: string) {
      let pos = gameStore.state.current_stage == 1 ? wasmStore.placement() : wasmStore.fight();
      if (turnColor == undefined) {
        turnColor = analyzeStore.state().active ? wasmStore.state.analyzeWasm?.side_to_move() : pos.side_to_move();
      }
      turnColor = turnColor == "w" ? "white" : "black";
      gameStore.state.side_to_move = turnColor == "white" ? 0 : 1;
      state.value.cg!.state.turnColor = turnColor as "black";
    },

    reset() {
      state.value = empty();
      others.value = emptyOthers();
    }

  };

});

function empty(): State {
  return {
    cg: undefined,
    element: undefined,
    top: undefined,
    bot: undefined,
    tvCgs: [],
    profileGames: [],
  };
}

function emptyOthers() {
  return {
    flippedBoard: false,
    premoveData: {
      orig: "",
      dest: "",
      active: false,
    },
    stage: 0
  }
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
