import type {
  GameInfo,
  LiveGameDraw,
  LiveGameFight,
  LiveGameLost,
  LiveGamePlace,
  LiveGameResign,
  RedirectDeploy,
  SpecCnt,
  UserLive,
} from "@/plugins/webSocketTypes";
import { ref } from "vue";
import { useUser } from "@/store/useUser";
import { useWs } from "@/store/useWs";
import { anonConfig, liveConfig } from "chessground12/configs";
import { useWasmStore } from "@/store/game/useWasmStore";
import { useAnalyzeStore } from "@/store/game/useAnalyzeStore";
import { useClockStore } from "@/store/game/useClockStore";
import router from "@/router";
import { updateHeadTitle } from "@/plugins/updateHeadTitle";
import { useShopStore } from "@/store/game/useShopStore";
import { playAudio } from "@/plugins/audio";
import { FenBtn, formatSfen } from "@/plugins/fen";
import { defineStore } from "pinia";
import { useCgStore } from "@/store/game/useCgStore";
import { ShuuroPosition } from "@/plugins/shuuro-wasm";
import type { Key } from "chessground12/types";
import { useHeaderSettings } from "../headerSettings";

const finished = [
  "Checkmate",
  "Draw",
  "RepetitionDraw",
  "MaterialDraw",
  "Stalemate",
];

export const useGameStore = defineStore("useGameStore", () => {
  const state = ref(emptyGame());
  const other = ref(emptyOther());
  const wasmStore = useWasmStore();
  const clockStore = useClockStore();
  const shopStore = useShopStore();
  const cgStore = useCgStore();
  const analyzeStore = useAnalyzeStore();
  const headerSettingsStore = useHeaderSettings();
  const user = useUser();
  const ws = useWs();

  return {
    state,
    other,

    loaded() {
      return other.value.server;
    },

    player() {
      return other.value.player;
    },

    playerColor(username?: string): string {
      let player = username
        ? this.findPlayer(username)
        : this.player().player;
      switch (player) {
        case 0:
          return "white";
        case 1:
          return "black";
        default:
          if (analyzeStore.isActive()) {
            return "both";
          }
          return "none";
      }
    },

    findPlayer(username: string): number {
      const index = state.value.players.findIndex((item) => item == username)!;
      return index;
    },

    config() {
      if (this.player().isPlayer && state.value.status < 1) {
        if (this.clientStage() == state.value.current_stage) {
          return liveConfig;
        }
      } else if (analyzeStore.isActive()) {
        return liveConfig;
      }
      return anonConfig;
    },

    clientStage(): number | 0 | 1 | 2 {
      return other.value.clientStage as 0 | 1 | 2;
    },

    offeredDraw() {
      return other.value.offeredDraw;
    },

    history() {
      return state.value.history[this.clientStage()];
    },

    rejectDraw() {
      other.value.offeredDraw = false;
    },

    watchCg() {
      cgStore.watch();
    },

    async fromServer(s: GameInfo) {
      state.value = s;
      other.value.server = true;
      this.startPosFix();
      this.setRedirect();
      state.value.min = s.min / 60000;
      state.value.incr = s.incr / 1000;
      state.value.last_clock = new Date(s.tc.last_click).toString();
      this.newClientStage(s.current_stage);
      clockStore.fromServer(s);
      this.setPlayer();
      this.updateHeadTitle();
      other.value.index = -1;
      clockStore.activateClock();
      await wasmStore.init();
      if (s.current_stage == 0) {
        shopStore.shopInfo();
      } else if (s.current_stage == 1) {
        this.setSfen(wasmStore.current()!);
      } else if (s.current_stage == 2) {
        this.setSfen(wasmStore.current()!);
      }
      this.resSound();
    },

    // redirect from ws
    silentRedirect(id: string): boolean {
      const { SEND } = useWs();
      if (id == undefined) {
        return true;
      } else if (id != state.value._id) {
        const obj = {
          t: "live_game_start",
          game_id: id,
          color: "white",
          variant: "shuuro",
        };
        SEND(obj);
        return false;
      }
      return true;
    },

    startPosFix() {
      if (state.value.current_stage == 2) {
        const last = state.value.history[1].at(-1);
        if (last) {
          state.value.history[2].unshift(last);
        }
      }
      // if (state.value.history[1].length > 0 || state.value.current_stage == 1) {
      //   state.value.history[2].unshift("");
      // }
    },

    // start normal clock
    startClock() {
      const elapsed = clockStore.elapsed();
      const stm = state.value.side_to_move;
      const other = clockStore.otherClock(stm);
      clockStore.setTime(other, state.value.tc.clocks[other]);
      clockStore.start(stm, state.value.tc.clocks[stm] - elapsed);
      clockStore.pause(other);
    },

    updateHeadTitle() {
      const players = state.value.players;
      updateHeadTitle(`${players[0]} vs ${players[1]}`);
    },

    setPlayer() {
      [0, 1].forEach((item) => {
        if (user.user.username == state.value.players[item]) {
          this.player().player = item;
          this.player().isPlayer = true;
          if (item == 1) cgStore.flipBoard();
        }
      });
    },

    setRedirect() {
      const r = router.currentRoute;
      if (state.value.status > 0) {
        const fullPath = r.value.fullPath;
        if (fullPath.startsWith(`/shuuro/${state.value.current_stage}`)) {
          this.newClientStage(state.value.current_stage);
        }
      }
      router.push({
        path: `/shuuro/${state.value.current_stage}/${state.value._id}`,
      });
    },

    resSound() {
      if (state.value.status <= 0) {
        this.audio("res");
      }
    },

    updateWatchCount(msg: SpecCnt): void {
      if (msg.game_id == state.value._id) {
        other.value.watchCount = msg.count;
      }
    },

    watchCount() {
      return other.value.watchCount;
    },

    index() {
      return other.value.index;
    },

    newClientStage(stage: number) {
      other.value.clientStage = stage;
    },

    canPlay(): boolean {
      if (
        state.value.side_to_move == other.value.player.player &&
        state.value.status < 1 // && other.value.index == this.history().length - 1
      ) {
        return true;
      }
      return false;
    },

    // legal moves for fight or analyze
    legal_moves(): Map<any, any> {
      const wasm = analyzeStore.isActive()
        ? wasmStore.analyze()
        : wasmStore.current()!;
      const color = !analyzeStore.isActive()
        ? wasm.side_to_move()
        : wasm.side_to_move();
      const sfen = wasm.generate_sfen().split(" ")[0];
      if (!sfen.includes("k") || !sfen.includes("K")) {
        return new Map();
      } else if (state.value.status < 0 || analyzeStore.isActive()) {
        const moves = wasm.legal_moves(color);
        cgStore.new_legal_moves(moves);
        return moves;
      }
      return new Map();
    },

    wasmMove(game_move: string, isServer: boolean) {
      const wasm = wasmStore.current()!;
      const beforeCount = wasm.pieces_count();
      const played = wasm.make_move(game_move);
      if (!played.toLowerCase().startsWith("illegal")) {
        const lastMove = wasm.last_move();
        const move = game_move.split("_");
        const newCount = wasm.pieces_count();
        if (isServer) {
          cgStore.cg()!.move(move[0] as Key, move[1] as Key);
          if (newCount != beforeCount) {
            this.audio("capture");
          } else {
            this.audio("move");
          }
          if (lastMove.includes("=")) {
            cgStore.setPieces(cgStore.cg()!, wasm);
          }
        }
        if (lastMove.includes("=")) {
          cgStore.setPieces(cgStore.cg()!, wasm);
        }
        cgStore.setTurnColor();
        cgStore.setCheck();
        clockStore.switchClock();
        if (!analyzeStore.isActive()) this.addMove(2, lastMove);
        this.scrollToBottom();
        other.value.index += 1;
        cgStore.cg()!.state.dom.redraw();
        this.legal_moves();
        this.playPremove();
      } else {
      }
    },

    playPremove() {
      if (cgStore.others.premoveData.active && this.canPlay()) {
        cgStore.cg()?.playPremove();
        cgStore.others.premoveData.active = false;
      }
    },

    send(t: string, game_move?: string) {
      if (analyzeStore.isActive()) return;
      const msg = {
        game_id: state.value._id,
        variant: state.value.variant,
        t,
        game_move,
      };
      ws.SEND(msg);
    },

    scrollToBottom(): void {
      const container = document.querySelector("#movelist");
      container!.scrollTop = container!.scrollHeight;
    },

    addMove(h: 0 | 1 | 2, move: string) {
      state.value.history[h].push(move);
    },

    addMoves(h: 0 | 1 | 2, moves: string[]) {
      state.value.history[h] = moves;
    },

    reset() {
      state.value = emptyGame();
      other.value = emptyOther();
      cgStore.reset();
      shopStore.reset();
      wasmStore.reset();
      clockStore.reset();
      analyzeStore.reset();
    },

    getSfen() {
      let history = this.history();
      let sfen = history.at(other.value.index);
      if (sfen == undefined) return;
      const position = new ShuuroPosition(state.value.variant);
      let formatted = formatSfen(sfen!);
      position.set_sfen(formatted.sfen);
      cgStore.setPieces(cgStore.cg()!, position, true);
      cgStore.setCheck(cgStore.cg(), position);
      const sound = formatted.capture ? "capture" : "move";
      this.audio(sound);
      this.clientStage() == 1
        ? cgStore.readPocket(false, cgStore.cg(), position)
        : null;
      position.free();
      if (formatted.game_move) {
        const parts = formatted.game_move.split("_");
        const from = parts[0];
        const to = parts[1];
        cgStore.cg()?.setLastMove(from, to);
      }
      else {
        cgStore.cg()?.setLastMove("", "")
      }
    },

    findFen(fenBtn: FenBtn) {
      const len = state.value.history[state.value.current_stage].length;
      const previous = other.value.index;
      switch (fenBtn) {
        case FenBtn.First:
          other.value.index = 0;
          break;
        case FenBtn.Previous:
          other.value.index -= 1;
          break;
        case FenBtn.Next:
          other.value.index += 1;
          break;
        case FenBtn.Last:
          other.value.index =
            state.value.current_stage == 0 ? len - 2 : len - 1;
          break;
      }
      if (other.value.index <= 0) {
        other.value.index = 0;
      } else if (other.value.index >= len) {
        other.value.index = len - 1;
      }
      if (other.value.clientStage == 0) return;
      else if (previous == other.value.index) return;
      this.getSfen();
      cgStore.enableMovable(fenBtn);
    },

    isLiveSfen(sfen: string): boolean {
      if (state.value.status < 0) {
        let historySfen = state.value.history[state.value.current_stage].at(-1);
        if (historySfen == sfen) {
          return true;
        }
      }
      return false;
    },

    serverPlace(msg: LiveGamePlace) {
      cgStore.wasmPlace(msg.game_move, true);
      clockStore.fromMove(msg.clocks);

      if (msg.to_fight) {
        state.value.current_stage = 2;
        this.newClientStage(2);
        state.value.tc.last_click = new Date().toString();
        clockStore.state.last_clock = new Date().toString();
        this.audio("res");
        router.push({ path: `/shuuro/2/${msg.game_id}` });
      }
      if (msg.first_move_error) {
        setTimeout(() => {
          this.audio("res");
          clockStore.pause(state.value.side_to_move);
          state.value.status = 1;
          state.value.result = state.value.side_to_move == 0 ? "w" : "b";
          cgStore.cg()!.set(anonConfig);
        }, 500);
      }
    },

    serverMove2(msg: LiveGameFight) {
      router.push({ path: `/shuuro/2/${msg.game_id}` });
      this.newClientStage(2);
      this.wasmMove(msg.game_move, true);
      clockStore.fromMove(msg.clocks);
      if (this.gameOver(msg.outcome)) {
        this.audio("res");
        clockStore.pauseBoth();
        state.value.status = msg.status;
        state.value.result = msg.outcome;
        this.scrollToBottom();
        cgStore.cg()?.set(anonConfig);
      }
    },

    gameOver(outcome: string) {
      for (let i = 0; i < finished.length; i++) {
        if (outcome.startsWith(finished[i])) {
          return true;
        }
      }
      return false;
    },

    gameDraw(msg: LiveGameDraw) {
      if (msg.draw) {
        this.gameEnd(5, "Draw");
      } else if (msg.player) {
        if (this.player().isPlayer && msg.player != user.user.username) {
          other.value.offeredDraw = true;
        }
      }
    },

    gameResign(msg: LiveGameResign) {
      if (msg.resign) {
        this.gameEnd(7, this.playerColor(msg.player));
      }
    },

    gameEnd(status: number, result: string) {
      this.audio("res");
      clockStore.pauseBoth();
      state.value.status = status;
      state.value.result = result;
      this.scrollToBottom();
      if (this.clientStage() != 0) cgStore.cg()?.set(anonConfig);
    },

    gameLot(msg: LiveGameLost) {
      if (msg.status == 8 || msg.status == 5) {
        this.gameEnd(msg.status, msg.result);
      }
    },

    redirectDeploy(s: RedirectDeploy) {
      clockStore.state.last_clock = new Date().toString();
      state.value.sfen = s.sfen;
      state.value.side_to_move = s.side_to_move[0] == "w" ? 0 : 1;
      clockStore.start(state.value.side_to_move);
      state.value.current_stage = 1;
      router.push({ path: s.path });
      this.audio("res");
    },

    setSfen(position: ShuuroPosition) {
      position.set_sfen(state.value.sfen);
      let interval = setInterval(() => {
        if (cgStore.cg()) {
          clearInterval(interval);
          this.clientStage() == 1 ? cgStore.readPocket(true) : null;
          cgStore.setPieces(cgStore.cg()!, position);
          cgStore.setPlinths(cgStore.cg()!, position);
          cgStore.setTurnColor();
          cgStore.setCheck();
          this.lastMoveIndex(this.clientStage());
          this.clientStage() == 2 ? this.legal_moves() : null;
        }
      }, 10);
    },

    lastMoveIndex(stage: number) {
      other.value.index = state.value.history[stage].length - 1;
    },

    sendMove(s: string) {
      if (!analyzeStore.isActive()) {
        this.send("live_game_play", s);
      }
    },

    audio(s: string) {
      const volume = headerSettingsStore.getSound();
      playAudio(s, volume);
    }
  };
});

function emptyGame(): GameInfo {
  return {
    _id: "",
    min: 0,
    incr: 0,
    players: ["", ""],
    status: 0,
    side_to_move: 0,
    last_clock: { $date: { $numberLong: "" } },
    current_stage: 0,
    result: "",
    variant: "",
    credits: [800, 800],
    hands: ["", ""],
    sfen: "",
    history: [[], [], []],
    tc: {
      last_click: "",
      clocks: [0, 0],
    },
    sub_variant: 100,
  };
}

function emptyOther() {
  return {
    watchCount: 0,
    offeredDraw: false,
    server: false,
    player: { isPlayer: false, player: 2 } as UserLive,
    clientStage: 0,
    index: 0,
  };
}
