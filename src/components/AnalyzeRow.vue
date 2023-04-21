<template>
  <vari id="vari69">
    <vari-move @click="selectSan(-1)">-</vari-move>
    <vari-move
      @click="selectSan(index)"
      v-for="(i, index) in analyzeStore.state.moves"
      :key="i"
      ply=""
      :class="{ active: index == analyzeStore.state.index }"
    >
      <san v-if="index != 0">{{ sanFormat(i) }}</san>
    </vari-move>
  </vari>
</template>

<script setup lang="ts">
import { useAnalyzeStore } from "@/store/game/useAnalyzeStore";

let analyzeStore = useAnalyzeStore();

function sanFormat(fen: string) {
  let parts = fen.split(" ");
  return `${parts[3]}. ${parts[5]} `;
}

function selectSan(index: number) {
  if (index == -1) {
    analyzeStore.reset();
  } else {
  }
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
