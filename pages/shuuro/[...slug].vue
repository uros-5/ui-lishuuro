<script lang="ts" setup>
definePageMeta({
  layout: "shuuro",
  middleware: "is-game-ts",
});
const game: Ref<{ id: string; stage: string }> = useState("game");

onMounted(() => {
  const router = useRouter();
  if (game.value.id) {
    router.push(`/shuuro/${game.value.id}-${game.value.stage}`);
  } else {
    router.push("/");
  }
});
</script>

<template>
  <div>Redirecting to game..</div>
</template>

<style scoped></style>
