import { ref } from "vue";
import { defineStore } from "pinia";

export const useAnalyzeStore = defineStore("useAnalyzeStore", () => {
  const analyze = ref(emptyAnalyze());
  return {analyze};
});

export type AnalyzeStore = {
  analyze: boolean;
  analysisMoves: string[];
  analyzeIndex: number;
};

export function emptyAnalyze(): AnalyzeStore {
  return {
    analyze: false,
    analyzeIndex: 0,
    analysisMoves: []
  }
}
