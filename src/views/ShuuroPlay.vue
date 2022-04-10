<template />
<script setup lang="ts">
import { onMounted } from "vue";
import { useShuuroStore2 } from "@/store/useShuuroStore2";

const shuuroStore = useShuuroStore2();
shuuroStore.updateClientStage("fight");

onMounted(() => {});
</script>

<style scoped></style>
