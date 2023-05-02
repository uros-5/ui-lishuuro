import { Clock } from "@/plugins/clock";
import type { GameInfo } from "@/plugins/webSocketTypes";
import { ref } from "vue";
import { defineStore } from "pinia";
import { useGameStore } from "@/store/game";
import { useShopStore } from "@/store/game/useShopStore";

export const useClockStore = defineStore("useClockStore", () => {
  const gameStore = useGameStore();
  const shopStore = useShopStore();
  const state = ref(empty());
  return {
    state,
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
      state.value.last_clock = s.tc.last_click;
    },

    fromMove(data: [number, number]) {
      [0, 1].forEach(
        (item) => (state.value.clocks[item].duration = data[item])
      );
    },

    elapsed(): number {
      const now = new Date();
      const converted_date = new Date(state.value.last_clock);
      const elapsed = now.getTime() - converted_date.getTime();
      return elapsed;
    },

    lowTimeNotif() {
      gameStore.audio("low_time");
    },

    activateClock() {
      [0, 1].forEach((item) => {
        state.value.clocks[item].onTick(state.value.clocks[item].renderTime);
        state.value.clocks[item].onHurryCallback(this.lowTimeNotif);
      });
      if (gameStore.state.status < 0) {
        if (gameStore.state.current_stage == 0) {
          shopStore.startClock();
        } else {
          gameStore.startClock();
        }
      } else {
        [0, 1].forEach((item) => {
          this.renderTime(item);
          this.pause(item);
        });
        this.fromMove(gameStore.state.tc.clocks);
      }
    },

    renderTime(clock: number) {
      const time = gameStore.state.tc.clocks[clock];
      state.value.clocks[clock].renderTime(time);
    },

    reset() {
      const old = empty();
      state.value.last_clock = old.last_clock;
      this.pauseBoth();
    },

    switchClock() {
      if (gameStore.state.status >= 0) return;
      const otherClock = this.otherClock(gameStore.state.side_to_move);
      this.pause(otherClock, true);
      this.start(gameStore.state.side_to_move);
    },
  };
});

type State = {
  clocks: [Clock, Clock];
  last_clock: string;
};

function empty(): State {
  return {
    clocks: [new Clock(0, 0, 0, "1"), new Clock(0, 0, 0, "0")],
    last_clock: new Date().toString(),
  };
}
