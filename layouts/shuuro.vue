<template>
  <ClientOnly>
    <main class="round" style="--zoom: 100">
      <ShuuroLeftSide />
      <ShuuroMain>
        <slot />
      </ShuuroMain>
    </main>
  </ClientOnly>
</template>

<script setup lang="ts">
const id = useState("gameid");
const gameStore = useGameStore();

useHead({
  title: headTitle(`Player1 vs Player2 - Live Shuuro Game - ${id}`),
  meta: [
    { name: "description", content: `Shuuro game` },
    { name: "author", content: "Uros" },
  ],
});

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
