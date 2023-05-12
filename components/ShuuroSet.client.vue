<template>
  <ShuuroChessground />
</template>
<script setup lang="ts">
const gameStore = useGameStore();
onMounted(() => gameStore.newClientStage(1));
</script>
