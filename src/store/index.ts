import { defineStore } from "pinia";

export const useStore = defineStore("main", {
  state: () => ({
    navVisible: false,
  }),
  getters: {
    navVisible(): boolean {
      return this.navVisible;
    },
  },
  actions: {
    toggle(): void {
      this.$state.navVisible = !this.$state.navVisible;
    },
    toggleFalse(): void {
      this.$state.navVisible = false;
    },
  },
});
