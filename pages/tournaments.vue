<template>
  <section class="tournaments-view">
    <h1>There are no available tournaments at the moment.</h1>
  </section>
</template>

<script setup lang="ts">
useHead({
  title: headTitle("Tournaments"),
  meta: [
    { name: "description", content: "Active tournaments at lishuuro.org" },
    { name: "keywords", content: "tournaments shuuro" },
  ],
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
