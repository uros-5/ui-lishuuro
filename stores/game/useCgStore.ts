import { deployCg, fightCg } from "#imports";
import type { Api } from "chessground12/api";
import { setCheck } from "chessground12/board";
import { p2 } from "chessground12/configs";
import type { ShuuroPosition } from "shuuro-wasm";
import { ref, watch, type WatchStopHandle } from "vue";
import { useGameStore } from "#imports";
import { useWasmStore } from "#imports";
import { readPockets } from "chessground12/pocket";
import type { Key, MoveMetadata, Piece, Color } from "chessground12/types";
import { useAnalyzeStore } from "#imports";
import { defineStore } from "pinia";
import { useClockStore } from "#imports";
import { FenBtn } from "#imports";
import { Stage } from ".";


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
      return state.value.cg;
    },
    isElementLoaded(): boolean {
      return state.value.element && gameStore.loaded() ? true : false;
    },
    isPocketReady(): boolean {
      return state.value.top && state.value.bot ? true : false;
    },
    isDifferentStage(stage: number): boolean {
      return others.value.stage != stage;
    },
    newElement(element: undefined | HTMLElement, id: CgElement) {
      switch (id) {
        case CgElement.Main:
          state.value.element = element;
          break;
        case CgElement.Top:
          state.value.top = element;
          break;
        case CgElement.Bot:
          state.value.bot = element;
          break;
      }
    },

    watch() {
      watcher = watch(
        state,
        (n, o) => {
          this.cgWatcher(n, o);
        },
        { deep: true }
      );
    },

    cgWatcher(newstate: State, _oldstate: State) {
      if (this.isElementLoaded()) {
        // console.log(newstate.element, others.value.stage, gameStore.clientStage())
        analyzeStore.isActive() ? (others.value.stage = 3) : null;
        if (gameStore.clientStage() == 1) {
          if (this.isPocketReady() && this.isDifferentStage(1)) {
            if (state.value.cg != undefined) return;
            others.value.stage = 1;
            const cg = deployCg(
              newstate.element!,
              gameStore.config(),
              newstate.top!,
              newstate.bot!,
              gameStore.state.variant
            );
            state.value.cg = cg;
            gameStore.player().player == 1 ? this.flipBoard(false) : null;
            this.changePocketRoles();
            cg.state.events.pocketSelect = this.pocketSelect;
            cg.state.events.dropNewPiece = this.afterPlace;
            cg.state.movable.color = gameStore.playerColor() as Color;
            const placement = wasmStore.current();
            if (placement) {
              gameStore.setSfen(placement);
            } else {
              wasmStore.watch();
            }
          }
        } else if (
          (gameStore.clientStage() == 2 || analyzeStore.isActive()) &&
          this.isDifferentStage(2)
        ) {
          if (state.value.cg != undefined) return;
          others.value.stage = 2;
          const cg = fightCg(
            newstate.element!,
            gameStore.config(),
            gameStore.state.variant
          );
          state.value.cg = cg;
          gameStore.player().player == 1 ? this.flipBoard(false) : null;
          this.enablePremove();
          state.value.cg.state.events.select = this.selectSq;
          state.value.cg.state.movable.events.after = this.afterMove;
          cg.state.movable.color = gameStore.playerColor();
          const fight = wasmStore.current();
          if (fight) {
            gameStore.setSfen(fight);
          } else {
            wasmStore.watch();
          }
        }
      }
    },

    getCg(cg?: Api): Api | undefined {
      return !cg ? this.cg() : cg;
    },

    getPosition(pos?: ShuuroPosition): ShuuroPosition | undefined {
      return !pos ? wasmStore.current() : pos;
    },

    flipBoard(force = true, cg?: Api) {
      const shop =
        gameStore.state.current_stage == 0 || gameStore.other.clientStage == 0;
      cg = !cg ? this.cg() : cg;
      !shop ? cg?.toggleOrientation() : null;
      if (force) {
        others.value.flippedBoard = !others.value.flippedBoard;
      }
    },

    flipped() {
      return others.value.flippedBoard;
    },

    setPieces(cg?: Api, sp?: ShuuroPosition, force = true) {
      sp = this.getPosition(sp);
      cg = this.getCg(cg);
      const pieces = sp?.map_pieces();
      if (!pieces) return;

      cg?.setPieces(pieces);
      if (force) {
        cg!.state.pieces = pieces;
        cg!.state.dom.redraw();
        cg!.state.dom.redraw();
      }
    },

    setPlinths(cg?: Api, sp?: ShuuroPosition, ignore?: boolean) {
      if (ignore == true) return;
      sp = this.getPosition(sp);
      cg = this.getCg(cg);
      const plinths = sp!.map_plinths();
      cg!.state.plinths = plinths;
      cg!.setPlinths(plinths);
    },

    setCheck(cg?: Api, sp?: ShuuroPosition) {
      sp = this.getPosition(sp);
      cg = this.getCg(cg);
      if (cg) {
        let check = sp!.is_check();
        setCheck(cg.state, check);
        cg.state.dom.redraw();
      }
    },

    changePocketRoles() {
      if (gameStore.state.variant.endsWith("Fairy")) {
        state.value.cg!.state.pocketRoles = p2;
      }
    },

    readPocket(force = false, cg?: Api, sp?: ShuuroPosition) {
      sp = this.getPosition(sp);
      cg = this.getCg(cg);
      const hand = sp!.count_hand_pieces();
      cg!.state.pockets = readPockets(
        `[${hand}]`,
        state.value.cg!.state.pocketRoles!
      );
      if (force) {
        cg!.state.dom.redrawNow();
        cg!.redrawAll();
      }
    },

    pocketSelect(piece: Piece) {
      if (!gameStore.canPlay()) {
        return;
      } else if (gameStore.other.index == gameStore.history().length - 1) {
        const ch = wasmStore.wasmPiece(piece);
        const moves = wasmStore.current()!.place_moves(ch);
        this.new_legal_moves(moves);
      }
    },

    afterPlace(piece: Piece, key: Key) {
      if (!gameStore.canPlay()) {
        return;
      }
      const p = wasmStore.wasmPiece(piece);
      const gameMove = `${p}@${key}`;
      gameStore.send("live_game_place", gameMove);
      this.wasmPlace(gameMove, false);
    },

    wasmPlace(gameMove: string, isServer: boolean) {
      const placed = wasmStore.current()!.place(gameMove);
      if (placed) {
        this.addWasmMove(1);
        this.wasmStm(1);
        if (isServer) {
        }
        this.setCheck();
      }
    },

    wasmMove(game_move: string, is_server: boolean) {
      const wasm = wasmStore.current()!;
      const beforeCount = wasm.pieces_count();
      const played = wasm.make_move(game_move);
      if (!played.toLowerCase().startsWith("illegal")) {
        const lastMove = wasm.last_move();
        const move = game_move.split("_");
        const newCount = wasm.pieces_count();
        if (is_server) {
          state.value.cg!.move(move[0] as Key, move[1] as Key);
          if (newCount != beforeCount) {
            gameStore.audio("capture");
          } else {
            gameStore.audio("move");
          }
          if (lastMove.includes("=")) {
            this.setPieces(state.value.cg!, wasm);
          }
        }
        if (lastMove.includes("=")) {
          this.setPieces(state.value.cg!, wasm);
        }
        this.setTurnColor();
        this.setCheck();
        clockStore.switchClock();
        if (!analyzeStore.isActive())
          gameStore.addMove(gameStore.state.current_stage as Stage, lastMove);
        else {
          analyzeStore.addAnalyzeMove(lastMove);
        }
        gameStore.scrollToBottom();
        gameStore.lastMoveIndex(gameStore.state.current_stage);
        state.value.cg!.state.dom.redraw();
        const lm = gameStore.legal_moves();
        this.new_legal_moves(lm);
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
      if (!analyzeStore.isActive()) {
        gameStore.send("live_game_play", s);
      }
    },

    addWasmMove(stage: 1 | 2) {
      const wasm = wasmStore.current()!;
      const last_move = wasm.last_move();
      gameStore.addMove(stage, last_move);
      gameStore.scrollToBottom();
      gameStore.lastMoveIndex(stage);
      stage == 1 ? this.readPocket() : null;
      gameStore.state.sfen = wasm.generate_sfen();
      gameStore.audio("move");
    },

    wasmStm(stage: 1 | 2) {
      const wasm = wasmStore.current()!;
      clockStore.pause(gameStore.state.side_to_move, false);
      this.setPieces(state.value.cg!, wasm);
      this.setTurnColor();
      clockStore.switchClock();
    },

    afterMove(orig: Key, dest: Key, _metadata: MoveMetadata) {
      const gameMove = `${orig}_${dest}`;
      this.wasmMove(gameMove, false);
      this.sendMove(gameMove);
      gameStore.audio("move");
      if (_metadata.captured!) {
        gameStore.audio("capture");
      }
    },

    enablePremove() {
      if (gameStore.player().isPlayer && gameStore.state.status < 1) {
        state.value.cg!.state.premovable.events = {
          set: (orig, dest) => {},
          unset: () => {},
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
      } else if (analyzeStore.isActive()) {
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

    setMovable(movable: boolean, cg?: Api) {
      cg = this.getCg(cg);
      cg!.state.movable.showDests = movable;
      cg!.state.draggable.enabled = movable;
      cg!.state.movable.color = analyzeStore.isActive()
        ? "both"
        : gameStore.playerColor();
    },

    setDraggable(draggable: boolean, cg?: Api) {
      cg = this.getCg(cg);
      cg!.state.draggable.enabled = draggable;
      cg!.state.dropmode.active = draggable;
    },

    enableMovable(fenBtn: FenBtn) {
      const enable = (value: boolean) => {
        this.setMovable(value);
        this.setDraggable(value);
      };
      if (analyzeStore.isActive()) {
        enable(true);
        this.setTurnColor();
        return;
      }
      const checks = [
        fenBtn == FenBtn.Last,
        gameStore.state.status < 0,
        gameStore.player().isPlayer,
        gameStore.state.current_stage == gameStore.clientStage(),
      ];
      !checks.includes(false) ? enable(true) : enable(false);
    },

    setTurnColor(turnColor?: string) {
      let pos = wasmStore.current()!;
      if (turnColor == undefined) {
        turnColor = pos.side_to_move();
      }
      turnColor = turnColor == "w" ? "white" : "black";
      if (!analyzeStore.isActive()) {
        gameStore.state.side_to_move = turnColor == "white" ? 0 : 1;
      }
      state.value.cg!.state.turnColor = turnColor as Color;
      if (analyzeStore.isActive()) {
        state.value.cg!.state.movable.color = turnColor as Color;
      }
    },

    newPiece(to: string, cg?: Api) {},

    reset() {
      state.value = empty();
      others.value = emptyOthers();
      // watcher();
    },
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
    stage: 0,
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

export enum CgElement {
  Main = 0,
  Top,
  Bot,
  None,
}

type premoveData = {
  orig: string;
  dest: string;
  active: boolean;
};
