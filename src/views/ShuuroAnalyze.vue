<template>
  <ShuuroChessground />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import ShuuroChessground from "@/components/ShuuroChessground.vue";
import { useGameStore } from "@/store/game";
import { useAnalyzeStore } from "@/store/game/useAnalyzeStore";

const gameStore = useGameStore();
const analyzeStore = useAnalyzeStore();
gameStore.newClientStage(2);

onMounted(async () => {
  if (gameStore.state._id == "") {
  } else {
    analyzeStore.toggle();
    if (!analyzeStore.canAnalyze()) {
      // gameStore.redirect("/");
    }
  }
});

onUnmounted(() => {
  analyzeStore.reset();
});
</script>

<style scoped>
.chessground12 {
  padding-bottom: 100%;
}

.chessground12 cg-board {
  background-image: url("@/assets/board/12x12brown.svg");
}

.chessground12 .standard8 cg-board {
  background-image: url("@/assets/board/8x8brown.svg");
}
</style>
