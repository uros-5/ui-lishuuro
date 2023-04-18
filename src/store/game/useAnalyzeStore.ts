import { defineStore } from "pinia";
import { ref } from "vue";

export const useAnalyzeStore = defineStore("useAnalyzeStore", () => {
  const state = ref(empty());
  return new class {

    get state() {
      return state
    }

    toggle() {
      state.value.active = !state.value.active
    }

    addAnalyzeMove(move: string) {
      state.value.moves.push(move)
    }

    newIndex(index: number) {
      state.value.index = index;
    }

    $reset() {
      state.value = empty();      
    }

  }
});

function empty() {
return  { active: false, moves: [] as string[], index: 0 } 
}