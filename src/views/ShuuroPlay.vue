<template>
  
</template>
<script setup lang="ts">

import { onMounted } from "vue";
import { useShuuroStore } from "@/store/useShuuroStore";

const shuuroStore = useShuuroStore();
shuuroStore.updateClientStage("fight");

onMounted(() => {});
</script>

<style scoped></style>
