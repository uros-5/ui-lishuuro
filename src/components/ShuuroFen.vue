<template>
  <div
    class="movelist-block"
    :class="{ 'movelist-block2': analyzeStore.state.active }"
  >
    <div id="movelist" :class="{ movelist2: analyzeStore.state.active }">
      <ShuuroFenItem
        v-for="(item, i) in gameStore.history"
        v-if="analyzeStore.state.moves.length == 0"
        :key="i"
        :fen="fenItem(item)"
        :move="moveItem(item)"
        :index="i + 1"
      />

      <AnalyzeRow v-if="analyzeStore.state.moves.length > 0" />

      <div id="result" v-if="showRes()">
        {{ resultMessage() }}
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import ShuuroFenItem from "./ShuuroFenItem.vue";
import { resultMessage as Rm } from "@/plugins/resultMessage";
import AnalyzeRow from "./AnalyzeRow.vue";
import { useGameStore } from "@/store/game";
import { useAnalyzeStore } from "@/store/game/useAnalyzeStore";

const gameStore = useGameStore();
const analyzeStore = useAnalyzeStore();

function fenItem(item: string): string {
  if (gameStore.clientStage == 0) {
    return `+${item[0]}`;
  }
  return item;
}

function moveItem(item: string): string {
  if (gameStore.clientStage == 0) {
    return `+${item}`;
  } else if (gameStore.clientStage == 1) {
    let fen = item.split("_");
    return fen[0];
  } else if (gameStore.clientStage == 2) {
    let fen = item.split(" ");
    return fen[5];
  }
  return "";
}

function resultMessage(): string {
  return Rm(
    gameStore.state.result,
    gameStore.state.status,
    gameStore.state.players
  );
}

function isFirst(index: number): boolean {
  return index == 0;
}

function showRes(): boolean {
  return (
    gameStore.state.status > 0 &&
    gameStore.clientStage == gameStore.state.current_stage
  );
}
</script>
<style scoped>
.movelist-block2 {
  display: flex;
  height: auto;
  max-height: none;
  overflow-y: scroll;
  justify-content: initial;
  grid-row: 3 / span 17;
}

@media (max-width: 799px) and (orientation: portrait) {
  .movelist-block2 {
    grid-row-start: 2;
    grid-row: none;
    grid-area: "moves";
  }
}

.movelist2 {
  height: auto !important;
  overflow-y: initial !important;
}
</style>
