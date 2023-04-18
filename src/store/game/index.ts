import type { GameInfo, UserLive } from "@/plugins/webSocketTypes";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useUser } from "../useUser";
import { useWs } from "../useWs";

export const useGameStore = defineStore("usegamestore", () => {
  const state = ref(emptyGame());
  const user = useUser();
  const watchCount = ref(0);
  const offeredDraw = ref(false);
  const server = ref(false);
  const player = ref({ isPlayer: false, player: 2 } as UserLive)
  const { SEND } = useWs();

  return new class {
    get state() {
      return state
    }

    get server() {
      return server
    }

    send(t: string, game_move?: string) {
      // if (analyze.analyze) return;
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

    get player() {
      return player
    }

    get playerColor(): string {
      switch(this.player.value.player) {
        case 0:
          return "white";
        case 1:
          return "black";
        default:
          return "none";
      }
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
