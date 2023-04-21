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

export const useGameStore = defineStore("useGameStore", () => {
  const state = ref(emptyGame());
  const other = ref(emptyOtherFields())
  const wasmStore = useWasmStore();
  const clockStore = useClockStore();
  const shopStore = useShopStore();
  const cgStore = useCgStore();
  const analyzeStore = useAnalyzeStore();
  const user = useUser();
  const watchCount = ref(0);
  const offeredDraw = ref(false);
  const server = ref(false);
  const player = ref({ isPlayer: false, player: 2 } as UserLive);
  const clientStage = ref(0);
  const index = ref(0);
  const ws = useWs();
  // console.log(wasmStore, analyzeStore, clockStore, shopStore, cgStore);
  return {
    state,
    other,
    get server() {
      return server;
    },

    get player() {
      return player.value;
    },

    get playerColor(): string {
      switch (this.player.player) {
        case 0:
          return "white";
        case 1:
          return "black";
        default:
          return "none";
      }
    },

    get config() {
      if (player.value.isPlayer && state.value.status < 1) {
        if (clientStage.value == state.value.current_stage) {
          return liveConfig;
        }
      } else if (analyzeStore.state.active) {
        return liveConfig;
      }
      return anonConfig;
    },

    get clientStage() {
      return clientStage.value;
    },

    get offeredDraw() {
      return offeredDraw;
    },

    get history() {
      return state.value.history[state.value.current_stage];
    },

    rejectDraw() {
      offeredDraw.value = false;
    },

    fromServer(s: GameInfo) {
      state.value = s;
      state.value.min = s.min / 60000;
      state.value.incr = s.incr / 1000;
      state.value.last_clock = new Date(s.tc.last_click).toString();
      clientStage.value = s.current_stage;
      clockStore.fromServer(s);
      this.setPlayer();
      server.value = true;
      this.updateHeadTitle();
      index.value = -1;
      this.startPosFix();
      this.setRedirect();
      if (s.current_stage == 0) {
        shopStore.shopInfo();
      } else if (s.current_stage == 1) {
      } else if (s.current_stage == 2) {
      }
      this.playLive();
    },

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

    updateHeadTitle() {
      const players = state.value.players;
      updateHeadTitle(`${players[0]} vs ${players[1]}`);
    },

    setPlayer() {
      if (user.user.username == state.value.players[0]) {
        player.value.player = 0;
        player.value.isPlayer = true;
      } else if (user.user.username == state.value.players[1]) {
        player.value.player = 1;
        player.value.isPlayer = true;
      } else {
        player.value.player = 2;
        player.value.isPlayer = false;
      }
    },

    setRedirect() {
      const r = router.currentRoute;
      if (state.value.status > 0) {
        const fullPath = r.value.fullPath;
        if (fullPath.startsWith(`/shuuro/${state.value.current_stage}`)) {
          clientStage.value = state.value.current_stage;
        }
      }
      router.push({
        path: `/shuuro/${state.value.current_stage}/${state.value._id}`,
      });
    },

    playLive() {
      if (state.value.status <= 0) {
        playAudio("res");
      }
    },

    updateWatchCount(msg: SpecCnt): void {
      if (msg.game_id == state.value._id) {
        watchCount.value = msg.count;
      }
    },

    get watchCount() {
      return watchCount;
    },

    index() {
      return index;
    },

    set clientStage(stage: number) {
      clientStage.value = stage;
    },

    get canPlay(): boolean {
      if (
        this.state.value.side_to_move == this.player.player &&
        this.state.value.status < 1
      ) {
        return true;
      }
      return false;
    },

    legal_moves(): Map<any, any> {
      const wasm2 = analyzeStore.state.active
        ? wasmStore.analyze()
        : wasmStore.fight();
      const color = !analyzeStore.state.active
        ? (this.playerColor[0] as string)
        : wasm2.side_to_move();
      if (state.value.status < 0 || analyzeStore.state.active) {
        const moves = wasm2.legal_moves(color);
        return moves;
      }
      return new Map();
    },

    send(t: string, game_move?: string) {
      if (analyzeStore.state.active) return;
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
    },

    findFen(fenBtn: FenBtn) {
      const len = state.value.history[state.value.current_stage].length;
      switch (fenBtn) {
        case FenBtn.First:
          index.value = 0;
          break;
        case FenBtn.Previous:
          index.value -= 1;
          break;
        case FenBtn.Next:
          index.value += 1;
          break;
        case FenBtn.Last:
          index.value = len - 1;
          break;
      }
      if (index.value <= 0) {
        index.value = 0;
      } else if (index.value >= len) {
        index.value = len;
      }
    },

    serverPlace(msg: LiveGamePlace) { },

    serverMove2(msg: LiveGameFight) { },

    gameDraw(msg: LiveGameDraw) { },

    gameResign(msg: LiveGameResign) { },

    gameLot(msg: LiveGameLost) { },

    redirectDeploy(s: RedirectDeploy) { },

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

function emptyOtherFields() {

  return {
    watchCount: 0,
    offeredDraw: false,
    server: false,
    player: { isPlayer: false, player: 2 } as UserLive,
    clientStage: 0,
    index: 0
  }
}
