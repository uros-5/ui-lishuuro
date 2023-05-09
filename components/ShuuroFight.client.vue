<script setup lang="ts">
const gameStore = useGameStore();
onMounted(() => gameStore.newClientStage(2));
</script>

<template>
  <span> <ShuuroChessground /></span>
</template>

<style>
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
