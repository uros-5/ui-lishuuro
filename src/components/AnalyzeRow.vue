<template>
  <vari id="vari69">
    <vari-move @click="selectSan(-1)">---</vari-move>
    <vari-move
      @click="selectSan(index)"
      v-for="(i, index) in history()"
      :key="i"
      ply=""
      :class="{ active: index == analyzeStore.state.index }"
    >
      <san>{{ sanFormat(i) }}</san>
    </vari-move>
  </vari>
</template>

<script setup lang="ts">
import { FenBtn } from "@/plugins/fen";
import { useGameStore } from "@/store/game";
import { useAnalyzeStore } from "@/store/game/useAnalyzeStore";

const analyzeStore = useAnalyzeStore();
const gameStore = useGameStore();

function sanFormat(fen: string) {
  let parts = fen.split(" ");
  return `${parts[3]}. ${parts[5]} `;
}

function selectSan(index: number) {
  if (index == -1) {
    analyzeStore.deleteMoves();
    gameStore.findFen(FenBtn.Last);
  } else {
    analyzeStore.newIndex(index);
    analyzeStore.selectSfen();
  }
}

function history() {
  return analyzeStore.moves();
}
</script>

<style scoped>
vari-move.active,
move.active {
  background-color: var(--blue-active);
}

vari-move {
  padding-left: 4px;
  cursor: pointer;
}
</style>
