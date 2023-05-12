<script lang="ts" setup>
definePageMeta({
  layout: "shuuro",
  middleware: "is-game-ts",
});
const game: Ref<{ id: string; stage: string }> = useState("game");

onMounted(() => {
  const gameStore = useGameStore();
  const route = useRoute();
  const stage = route.params.stage;
  const id = route.params.id;
  game.value.stage = stage as string;
  game.value.id = id as string;
});
</script>

<template>
  <span v-if="game.stage == '0'"> <ShuuroShop /></span>
  <span v-else-if="game.stage == '1'"> <ShuuroSet /></span>
  <span v-else-if="game.stage == '2'"> <ShuuroFight /></span>
  <span v-else-if="game.stage == '3'"> <ShuuroAnalyze /></span>
  <span v-else>This game doesn't exist</span>
</template>

<style scoped></style>
