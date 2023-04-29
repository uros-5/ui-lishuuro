<template>
  <div
    class="btn-controls after"
    v-if="analyzeStore.canAnalyze() && analyzeStore.isActive() == false"
  >
    <button
      v-if="analyzeStore.canAnalyze() && analyzeStore.isActive() == false"
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
import { useCgStore } from "@/store/game/useCgStore";

const gameStore = useGameStore();
const analyzeStore = useAnalyzeStore();
const cgStore = useCgStore();

function analyze() {
  cgStore.others.stage = 0;
  router.push(`/shuuro/3/${gameStore.state._id}`);
  gameStore.scrollToBottom();
}

function isVisible() {}
</script>
