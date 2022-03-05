<template>
  <ChessGround />
</template>
<script setup lang="ts">
import ChessGround from "@/components/ChessGround.vue";
import { onMounted } from "vue";
import init, { greet } from "shuuro-wasm";

onMounted(() => {
  init().then((exports) => {
    exports.greet();
  });
});
</script>

<style scoped></style>
