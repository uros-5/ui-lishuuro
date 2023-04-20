<template>
  <ShuuroChessground />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import ShuuroChessground from "@/components/ShuuroChessground.vue";
import { useGameStore } from "@/store/game";

const shuuroStore = useGameStore();
shuuroStore.updateStage = 2;

onMounted(async () => {
  if (shuuroStore.game_id == "") {
  } else {
    shuuroStore.analyze = true;
    if (!shuuroStore.canAnalyze()) {
      shuuroStore.redirect("/");
    }
  }
});

onUnmounted(() => {
  shuuroStore.analyze = false;
  shuuroStore.analysisMoves = [];
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
