<template>
  <span><ShuuroShop /></span>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "shuuro",
  middleware: "is-game-ts",
  pageTransition: true,
  layoutTransition: false,
});
</script>
