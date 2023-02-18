<template>
  <section class="tournaments-view">
    <h1>There is no available tournaments at the moment.</h1>
  </section>
</template>

<script setup lang="ts">
import { updateHeadTitle } from "@/plugins/updateHeadTitle";
import { onMounted } from "vue";

onMounted(() => {
  updateHeadTitle("Tournaments");
});
</script>

<style>
.tournaments-view {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  grid-area: main;
  font-size: 1.3em;
}

.tournaments-view h1 {
  border: 1px solid var(--hover-green);
}
</style>
