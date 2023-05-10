<template>
  <ShuuroAnalyze />
</template>

<script setup lang="ts">
definePageMeta({
  layout: "shuuro",
  pageTransition: false,
  layoutTransition: false,
});
useHead(useShuuroHead());
</script>
