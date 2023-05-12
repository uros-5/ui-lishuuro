<template>
  <main class="round" style="--zoom: 100">
    <ShuuroLeftSide />
    <ShuuroMain>
      <slot />
    </ShuuroMain>
  </main>
</template>

<script setup lang="ts">
const game: Ref<{ id: string; stage: string }> = useState("game");
const headData = await useFetch(`/api/game/?id=${game.value.id}`);
useHead(useShuuroHead(headData.data.value as string));
onMounted(() => {});
</script>

<style>
@import "../assets/styles/round.css";
</style>
