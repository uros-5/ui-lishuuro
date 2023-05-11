<template>
  <ShuuroChessground />
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
</style>
