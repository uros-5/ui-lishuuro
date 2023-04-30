<template>
  <div id="btn-controls-top" class="btn-controls" :style="materialTop()">
    <button id="flip" @click="cgStore.flipBoard">
      <i class="icon icon-refresh" /></button
    ><button @click="findFen(FenBtn.First)">
      <i class="icon icon-fast-backward" /></button
    ><button @click="findFen(FenBtn.Previous)">
      <i class="icon icon-step-backward" /></button
    ><button @click="findFen(FenBtn.Next)">
      <i class="icon icon-step-forward" />
    </button>
    <button @click="findFen(FenBtn.Last)">
      <i class="icon icon-fast-forward" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { FenBtn } from "@/plugins/fen";
import { useGameStore } from "@/store/game";
import { useAnalyzeStore } from "@/store/game/useAnalyzeStore";
import { useCgStore } from "@/store/game/useCgStore";

const cgStore = useCgStore();
const analyzeStore = useAnalyzeStore();
const gameStore = useGameStore();

function materialTop(): string {
  if (analyzeStore.isActive()) {
    return "grid-area: mat-top;";
  } else {
    return "";
  }
}

function findFen(btn: FenBtn) {
  analyzeStore.isActive() && analyzeStore.moves().length > 0
    ? analyzeStore.findFen(btn)
    : gameStore.findFen(btn);
}
</script>
<style></style>
