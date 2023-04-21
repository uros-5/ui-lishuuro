<template>
  <div
    class="btn-controls after"
    v-if="analyzeStore.canAnalyze && analyzeStore.state.active == false"
  >
    <button
      v-if="analyzeStore.canAnalyze && analyzeStore.state.active == false"
      @click="analyze"
      class="analysis"
    >
      ANALYSIS BOARD
    </button>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from "@/store/game";
import { useAnalyzeStore } from "@/store/game/useAnalyzeStore";
import router from "@/router";

const gameStore = useGameStore();
const analyzeStore = useAnalyzeStore();

function analyze() {
  analyzeStore.toggle();
  router.push(`/shuuro/3/${gameStore.state._id}`);
  gameStore.scrollToBottom();
}

function isVisible() {}
</script>
