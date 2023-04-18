import { deployCg, fightCg } from "@/plugins/cg";
import { Chessground } from "chessground12";
import type { Api } from "chessground12/api";
import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { useGameStore } from ".";

export const useCgStore = defineStore("useCgStore", () => {
  const state = ref(empty());
  const game = useGameStore();

  const cgwatcher = (newstate: State, _oldstate: State) => {
    if (newstate.element && game.server) {
      if (game.state.current_stage == 1) {
        if (newstate.top && newstate.bot && newstate.stage != 1) {
          state.value.stage = 1;
          const cg = deployCg(newstate.element, config, newstate.top, newstate.bot, game.state.variant);
          state.value.cg = cg;
          // new cg
        }
      }
      else if(game.state.current_stage == 2 && newstate.stage != 2 ) {
        state.value.stage = 2;
        const cg = fightCg(newstate.element, config, game.state.variant);
        state.value.cg = cg;
      }
    }
  };
  
  watch(state, (newstate, oldstate, _clean)  => {
    cgwatcher(newstate, oldstate);
  });
  return new class {

  }
})

function empty(): State {
  const element = new HTMLElement();
  return { cg: Chessground(element), element, top: null, bot: null, tvCgs: [], profileGames: [], stage: 0 }
}

type State = {
  cg: Api,
  element: HTMLElement | null | undefined,
  top: HTMLElement | null | undefined,
  bot: HTMLElement | null | undefined,
  tvCgs: Api[],
  profileGames: Api[]
  stage: number
}