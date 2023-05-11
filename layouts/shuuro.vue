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
const headData = await useFetch(`/api/game/?id=${id.value}`);
useHead(useShuuroHead(headData.data.value as string));
onMounted(() => {});
</script>

<style>
@import "../assets/styles/round.css";
</style>
