import type { GameInfo, UserLive } from "@/plugins/webSocketTypes";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useUser } from "../useUser";
import { useWs } from "../useWs";

export const useGameStore = defineStore("usegamestore", () => {
  const game = ref(emptyGame());
  const user = useUser();
  const watchCount = ref(0);
  const offeredDraw = ref(false);
  const player = ref({ isPlayer: false, player: 2 } as UserLive)
  const {SEND} = useWs();

  return new class {
    get game() {
      return game
    }


    send(t: string, game_move?: string) {
      // if (analyze.analyze) return;
      let msg = { game_id: game.value._id, variant: game.value.variant, t, game_move };
      SEND(msg);
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
