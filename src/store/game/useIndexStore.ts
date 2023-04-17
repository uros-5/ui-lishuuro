import { defineStore } from "pinia";
import { ref } from "vue";

export const useIndexStore = defineStore("useIndexStore", () => {
  const state = ref({ live: 0, analyze: 0 })
  return new class {
    get state() {
      return state
    }

    set live(index: number) {
      state.value.live = index
    }

    set analyze(index: number) {
      state.value.analyze = index
    }
  }
});