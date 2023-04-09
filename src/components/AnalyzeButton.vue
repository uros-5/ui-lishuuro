<template>
  <div
    class="btn-controls after"
    v-if="
      shuuroStore.canAnalyze() &&
      shuuroStore.analyze == false &&
      shuuroStore.current_stage == 2
    "
  >
    <button
      v-if="shuuroStore.canAnalyze() && shuuroStore.analyze == false"
      @click="analyze"
      class="analysis"
    >
      ANALYSIS BOARD
    </button>
  </div>
</template>

<script setup lang="ts">
import { useShuuroStore } from "@/store/useShuuroStore";
const shuuroStore = useShuuroStore();

function analyze() {
  shuuroStore.analyze = true;
  shuuroStore.redirect(`/shuuro/3/${shuuroStore.game_id}`);
  shuuroStore.scrollToBottom();
}

function isVisible() {}
</script>
