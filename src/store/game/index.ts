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
import { ref, watch } from "vue";
import { useUser } from "../useUser";
import { useWs } from "../useWs";
import { anonConfig, liveConfig } from "chessground12/configs";
import { useWasmStore } from "./useWasmStore";
import { useAnalyzeStore } from "./useAnalyzeStore";
import { useClockStore } from "./useClockStore";
import router from "@/router";
import { updateHeadTitle } from "@/plugins/updateHeadTitle";
import { useShopStore } from "./useShopStore";
import { playAudio } from "@/plugins/audio";
import { FenBtn } from "@/plugins/fen";
import { defineStore } from "pinia";
import { useCgStore } from "./useCgStore";
import type { ShuuroPosition } from "shuuro-wasm";

export const useGameStore = defineStore("useGameStore", () => {
  const state = ref(emptyGame());
  const other = ref(emptyOther());
  const wasmStore = useWasmStore();
  const clockStore = useClockStore();
  const shopStore = useShopStore();
  const cgStore = useCgStore();
  const analyzeStore = useAnalyzeStore();
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

    playerColor(): string {
      switch (this.player().player) {
        case 0:
          return "white";
        case 1:
          return "black";
        default:
          return "none";
      }
    },

    getColor(username: string): string {
      const index = state.value.players.findIndex((item) => item == username)!;
      return index == 0 ? "white" : "black";
    },

    config() {
      if (this.player().isPlayer && state.value.status < 1) {
        if (this.clientStage() == state.value.current_stage) {
          return liveConfig;
        }
      } else if (analyzeStore.state().active) {
        return liveConfig;
      }
      return anonConfig;
    },

    clientStage() {
      return other.value.clientStage;
    },

    offeredDraw() {
      return other.value.offeredDraw;
    },

    history() {
      return state.value.history[state.value.current_stage];
    },

    rejectDraw() {
      other.value.offeredDraw = false;
    },

    watchCg() {
      cgStore.watch();
    },

    async fromServer(s: GameInfo) {
      state.value = s;
      this.setRedirect();
      state.value.min = s.min / 60000;
      state.value.incr = s.incr / 1000;
      state.value.last_clock = new Date(s.tc.last_click).toString();
      this.newClientStage(s.current_stage)
      clockStore.fromServer(s);
      this.setPlayer();
      other.value.server = true;
      this.updateHeadTitle();
      other.value.index = -1;
      this.startPosFix();
      clockStore.activateClock();
      await wasmStore.init();
      if (s.current_stage == 0) {
        shopStore.shopInfo();
      } else if (s.current_stage == 1) {
        this.setSfen(wasmStore.placement())
      } else if (s.current_stage == 2) {
        this.setSfen(wasmStore.fight())
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
      [0, 1].forEach(item => {
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
        playAudio("res");
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
        this.state.value.side_to_move == this.player().player &&
        this.state.value.status < 1
      ) {
        return true;
      }
      return false;
    },


    // legal moves for fight or analyze
    legal_moves(): Map<any, any> {
      const wasm = analyzeStore.state().active
        ? wasmStore.analyze()
        : wasmStore.fight();
      const color = !analyzeStore.state().active
        ? wasmStore.analyze().side_to_move()
        : wasm.side_to_move();
      if (state.value.status < 0 || analyzeStore.state().active) {
        const moves = wasm.legal_moves(color);
        return moves;
      }
      return new Map();
    },

    send(t: string, game_move?: string) {
      if (analyzeStore.state().active) return;
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

    findFen(fenBtn: FenBtn) {
      const len = state.value.history[state.value.current_stage].length;
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
          other.value.index = state.value.current_stage == 0
            ? len - 2 :
            len - 1;
          break;
      }
      if (other.value.index <= 0) {
        other.value.index = 0;
      } else if (other.value.index >= len) {
        other.value.index = len;
      }
      if (other.value.clientStage == 0) return;
    },

    isLiveSfen(sfen: string): boolean {
      if (state.value.status < 0) {
        let historySfen = state.value.history[state.value.current_stage].at(-1);
        if (historySfen == sfen) {
          return true
        }
      }
      return false;
    },

    serverPlace(msg: LiveGamePlace) { },

    serverMove2(msg: LiveGameFight) { },

    gameDraw(msg: LiveGameDraw) {
      if (msg.draw) {
        this.gameEnd(5, "Draw");
      }
        else if (msg.player) {
          if (this.player().isPlayer && msg.player != user.user.username) {
            other.value.offeredDraw = true;
          }
        }
      
     },

    gameResign(msg: LiveGameResign) {
      if (msg.resign) {
        this.gameEnd(7, this.getColor(msg.player));
      }

    },

    gameEnd(status: number, result: string) {
      playAudio('res')
      clockStore.pauseBoth();
      state.value.status = status;
      state.value.result = result;
      this.scrollToBottom();
      if (this.clientStage() != 0) cgStore.state.cg?.set(anonConfig);

    },

    gameLot(msg: LiveGameLost) {
      if (msg.status == 8 || msg.status == 5) {
        this.gameEnd(msg.status,msg.result);
      }
    },

    redirectDeploy(s: RedirectDeploy) {
      clockStore.state.last_clock = new Date().toString();
      state.value.sfen = s.sfen;
      router.push({ path: s.path });
      state.value.side_to_move = s.side_to_move[0] == "w" ? 0 : 1;
      clockStore.start(state.value.side_to_move);
      state.value.current_stage = 1;
      state.value.history[1].push(s.sfen);
      playAudio("res");
    },

    setSfen(position: ShuuroPosition) {
      position.set_sfen(state.value.sfen);
      let interval = setInterval(() => {
        if (cgStore.state.cg) {
          cgStore.setPlinths(cgStore.state.cg!, position);
          cgStore.setPieces(cgStore.state.cg!, position);
          cgStore.wasmPocket();
          clearInterval(interval);
        }
      }, 10)
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
