import { Clock } from "@/plugins/clock";
import type { GameInfo } from "@/plugins/webSocketTypes";
import { ref } from "vue";
import { defineStore } from "pinia";

export const useClockStore = defineStore("useClockStore", () => {
  const state = ref(empty());
  return {
    start(id: number, duration = 0) {
      state.value.clocks[id].start(duration);
    },

    pause(id: number, incr = true) {
      state.value.clocks[id].pause(incr);
    },

    setTime(id: number, ms: number) {
      state.value.clocks[id].setTime(ms);
    },

    pauseBoth() {
      const self = this;
      [0, 1].forEach((item) => self.pause(item, false));
    },

    startBoth(elapsed: number, clocks: [number, number]) {
      const self = this;
      [0, 1].forEach((item) => self.start(item, clocks[item] - elapsed));
    },

    otherClock(id: number) {
      return id == 0 ? 1 : 0;
    },

    setLastClock(last_clock: string) {
      state.value.last_clock = new Date(last_clock).toString();
    },

    fromServer(s: GameInfo) {
      state.value.clocks = [
        new Clock(s.min / 60000, s.incr / 1000, 0, "1") as any,
        new Clock(s.min / 60000, s.incr / 1000, 0, "0") as any,
      ];
    },

    fromMove(data: [number, number]) {
      [0, 1].forEach(
        (item) => (state.value.clocks[item].duration = data[item])
      );
    },

    get elapsed(): number {
      const now = new Date();
      const converted_date = new Date(state.value.last_clock);
      const elapsed = now.getTime() - converted_date.getTime();
      return elapsed;
    },

    get state() {
      return state.value;
    }
  }
});

function empty(): { clocks: [Clock, Clock]; last_clock: string } {
  return {
    clocks: [new Clock(0, 0, 0, "1"), new Clock(0, 0, 0, "0")],
    last_clock: new Date().toString(),
  };
}
