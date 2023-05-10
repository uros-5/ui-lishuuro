<template>
  <main class="round" style="--zoom: 100">
    <ShuuroLeftSide />
    <ShuuroMain>
      <slot />
    </ShuuroMain>
  </main>
</template>

<script setup lang="ts">
const id = useState("gameid");
const gameStore = useGameStore();

onMounted(() => {
  gameStore.mounted(id.value);
});

onUnmounted(() => {
  gameStore.unMounted();
});
</script>

<style>
@import "../assets/styles/round.css";
</style>
