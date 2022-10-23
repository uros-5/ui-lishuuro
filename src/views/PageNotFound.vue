<template>
  <h1>Page not found</h1>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { updateHeadTitle } from "@/plugins/updateHeadTitle";

onMounted(() => {
  updateHeadTitle("Page not found");
});
</script>
