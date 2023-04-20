<template>
  <div id="btn-controls-top" class="btn-controls" :style="materialTop()">
    <button id="flip" @click="cgStore.flipBoard()">
      <i class="icon icon-refresh" /></button
    ><button @click="fastBackward">
      <i class="icon icon-fast-backward" /></button
    ><button @click="stepBackward">
      <i class="icon icon-step-backward" /></button
    ><button @click="stepForward">
      <i class="icon icon-step-forward" />
    </button>
    <button @click="fastForward">
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
  if (analyzeStore.state.active) {
    return "grid-area: mat-top;";
  } else {
    return "";
  }
}

function fastBackward(): void {
  analyzeStore.state.active
    ? analyzeStore.findFen(FenBtn.First)
    : gameStore.findFen(FenBtn.First);
}

function stepBackward(): void {
  analyzeStore.state.active
    ? analyzeStore.findFen(FenBtn.Previous)
    : gameStore.findFen(FenBtn.Previous);
}

function stepForward(): void {
  analyzeStore.state.active
    ? analyzeStore.findFen(FenBtn.Next)
    : gameStore.findFen(FenBtn.Next);
}

function fastForward(): void {
  analyzeStore.state.active
    ? analyzeStore.findFen(FenBtn.Last)
    : gameStore.findFen(FenBtn.Last);
}
</script>
<style></style>
