import { Clock } from "@/plugins/clock";
import type { GameInfo } from "@/plugins/webSocketTypes";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useClockStore = defineStore("useClockStore", () => {
  const clock = ref(empty());
  return new class {
    start(id: number) {
      clock.value.clocks[id].start();
    }

    pause(id: number, incr = true) {
      clock.value.clocks[id].pause(incr);
      this.setms(id, clock.value.clocks[id].duration)
    }

    private setms(id: number, ms: number, decr?: boolean) {
      decr == true ? clock.value.clock_ms[id] -= ms
        : clock.value.clock_ms[id] = ms;
    }

    setTime(id: number, ms: number) {
      clock.value.clocks[id].setTime(ms);
    }

    pauseBoth() {
      let self = this;
      [0, 1].forEach(item => self.pause(item, false))
    }

    startBoth() {
      let self = this;
      [0, 1].forEach(item => self.start(item))
    }

    otherClock(id: number) {
      return id == 0 ? 1 : 0;
    }

    setLastClock(last_clock: string) {
      clock.value.last_clock = new Date(last_clock).toString()
    }

    fromServer(s: GameInfo) {
      clock.value.clocks = [
        new Clock(s.min / 60000, s.incr / 1000, 0, "1") as any,
        new Clock(s.min / 60000, s.incr / 1000, 0, "0") as any,
      ];
      clock.value.clock_ms = [...(s.tc.clocks)];
    }

    fromMove(data: [number, number]) {
      [0, 1].forEach(item => clock.value.clocks[item].duration = data[item])
    }

    get elapsed(): number {
      const now = new Date();
      const converted_date = new Date(clock.value.last_clock);
      const elapsed = now.getTime() - converted_date.getTime();
      return elapsed;
    }

    get clock() {
      return clock
    }
  };
});

function empty(): { clocks: [Clock, Clock], clock_ms: [number, number], last_clock: string } {
  return {
    clocks: [new Clock(0, 0, 0, "1"), new Clock(0, 0, 0, "0")],
    clock_ms: [0, 0],
    last_clock: new Date().toString()
  }
}