<template>
  <ShuuroFight />
</template>

<script setup lang="ts">
definePageMeta({
  layout: "shuuro",
  middleware: "is-game-ts",
  pageTransition: false,
  layoutTransition: false,
});
</script>
