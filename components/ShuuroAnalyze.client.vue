<template>
  <span> <ShuuroChessground /></span>
</template>

<script setup lang="ts">
const gameStore = useGameStore();
const analyzeStore = useAnalyzeStore();

onMounted(async () => {
  gameStore.newClientStage(2);
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
  background-image: url("public/board/12x12brown.svg");
}

.chessground12 .standard8 cg-board {
  background-image: url("public/board/8x8brown.svg");
}
</style>
