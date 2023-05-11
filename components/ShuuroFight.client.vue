<script setup lang="ts">
const gameStore = useGameStore();
onMounted(() => gameStore.newClientStage(2));
</script>

<template>
  <ShuuroChessground />
</template>

<style>
.chessground12 {
  padding-bottom: 100%;
}
</style>
