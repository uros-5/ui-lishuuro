import { Clock } from "@/plugins/clock";
import { defineStore } from "pinia"
import { ref } from "vue"

export const useClockStore = defineStore("useClockStore", () => {
  const clock = ref(emptyClock());
  return {clock};
});

export function emptyClock(): [Clock, Clock] {
  return [new Clock(0, 0, 0, "1"), new Clock(0, 0, 0, "2")]
}
