import { FenBtn } from "@/plugins/fen";
import { ref } from "vue";
import { useGameStore } from ".";
import { defineStore } from "pinia";

export const useAnalyzeStore = defineStore("useAnalyzeStore", () => {
  const state = ref(empty());
  const gameStore = useGameStore();
  // console.log(gameStore);
  return {
    get state() {
      return state.value;
    },

    toggle() {
      state.value.active = !state.value.active;
    },

    addAnalyzeMove(move: string) {
      state.value.moves.push(move);
    },

    newIndex(index: number) {
      state.value.index = index;
    },

    reset() {
      state.value = empty();
    },

    findFen(fenBtn: FenBtn) {
      const len = state.value.moves.length;
      switch (fenBtn) {
        case FenBtn.First:
          state.value.index = 0;
          break;
        case FenBtn.Previous:
          state.value.index -= 1;
          break;
        case FenBtn.Next:
          state.value.index += 1;
          break;
        case FenBtn.Last:
          state.value.index = len - 1;
          break;
      }
      if (state.value.index <= 0) {
        state.value.index = 0;
      } else if (state.value.index >= len) {
        state.value.index = len;
      }
    },

    get canAnalyze(): boolean {
      if (gameStore.state.current_stage == 2 && gameStore.state.status > -1) {
        return true;
      }
      return false;
    }
  };

});

function empty() {
  return { active: false, moves: [] as string[], index: 0 };
}

