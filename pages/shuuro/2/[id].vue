<template>
  <span> <ShuuroFight /></span>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "shuuro",
  middleware: "is-game-ts",
});
</script>
