<template>
  <ShuuroShop />
</template>

<script setup lang="ts">
useHead(useShuuroHead());
useServerHeadSafe(useShuuroHead());
definePageMeta({
  layout: "shuuro",
  middleware: "is-game-ts",
  pageTransition: true,
  layoutTransition: false,
});
</script>
