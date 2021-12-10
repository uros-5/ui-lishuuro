<template>
  <p>{{ text }}</p>
</template>
<script setup lang="ts">
const props = defineProps({ text: String });
</script>
<style scoped>
p {
  color: green;
}
</style>
