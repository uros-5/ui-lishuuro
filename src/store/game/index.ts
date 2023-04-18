import type { GameInfo, UserLive } from "@/plugins/webSocketTypes";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useUser } from "../useUser";
import { useWs } from "../useWs";
import { anonConfig, liveConfig, p2 } from "chessground12/configs";
import { useWasmStore } from "./useWasmStore";
import { useCgStore } from "./useCgStore";
import { useAnalyzeStore } from "./useAnalyzeStore";

export const useGameStore = defineStore("usegamestore", () => {
  const state = ref(emptyGame());
  const user = useUser();
  const wasm = useWasmStore();
  const analyze = useAnalyzeStore();
  const cg = useCgStore();
  const watchCount = ref(0);
  const offeredDraw = ref(false);
  const server = ref(false);
  const player = ref({ isPlayer: false, player: 2 } as UserLive)
  const clientStage = ref(0);
  const index = ref(0);
  const { SEND } = useWs();

  return new class {
    get state() {
      return state
    }

    get server() {
      return server
    }

    get player() {
      return player
    }

    get playerColor(): string {
      switch (this.player.value.player) {
        case 0:
          return "white";
        case 1:
          return "black";
        default:
          return "none";
      }
    }

    get config() {
      const config =
        player.value.isPlayer && state.value.status < 1 ? liveConfig : anonConfig;
      return config;
    }

    get clientStage() {
      return clientStage
    }

    fromServer(_: GameInfo) {
      server.value = true;
    }

    index() {
      return index
    }

    set updateStage(stage: number) {
      clientStage.value = stage;
    }

    get canPlay(): boolean {
      if (this.state.value.side_to_move == this.player.value.player
        && this.state.value.status < 1) {
        return true;
      }
      return false;
    }

    legal_moves(): Map<any, any> {
      let wasm2 = analyze.state.active ? wasm.analyze() : wasm.fight();
      let color = !analyze.state.active ? this.playerColor[0] as string : wasm2.side_to_move();
      if (state.value.status < 0 || analyze.state.active) {
        const moves = wasm2.legal_moves(color);
        return moves
      }
      return new Map()
    }

    send(t: string, game_move?: string) {
      if (analyze.state.active) return;
      let msg = { game_id: state.value._id, variant: state.value.variant, t, game_move };
      SEND(msg);
    }

    scrollToBottom(): void {
      const container = document.querySelector("#movelist");
      container!.scrollTop = container!.scrollHeight;
    }

    addMove(h: 0 | 1 | 2, move: string) {
      state.value.history[h].push(move)
    }

    addMoves(h: 0 | 1 | 2, moves: string[]) {
      state.value.history[h] = moves;
    }
  }
});


function emptyGame(): GameInfo {
  return {
    _id: "",
    min: 0,
    incr: 0,
    players: ["", ""],
    status: 0,
    side_to_move: 0,
    last_clock: { '$date': { "$numberLong": "" } },
    current_stage: 0,
    result: "",
    variant: "",
    credits: [800, 800],
    hands: ["", ""],
    sfen: "",
    history: [[], [], []],
    tc: {
      last_click: "",
      clocks: [0, 0]
    },
    sub_variant: 100
  }
}
