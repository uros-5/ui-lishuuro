<template>
  <ChessGround />
</template>
<script setup lang="ts">
import ChessGround from "@/components/ChessGround.vue";
import { onMounted } from "vue";
import { useShuuroStore } from "@/store/useShuuroStore";

const shuuroStore = useShuuroStore();
shuuroStore.updateClientStage("fight");

onMounted(() => {});
</script>

<style scoped></style>
