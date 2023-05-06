<template>
  <div class="lobby">
    <HomeLeftSide />
    <HomeContacts />
    <HomeLobby />
    <HomeVariants />
    <HomeBlogNews />
    <HomeLobbyButtons />
    <HomeSpectators />
  </div>
</template>

<script setup lang="ts">
onMounted(() => {
  updateHeadTitle("Home");
});
</script>

<style>
:root {
  --main-max-width: 1300px;
}
</style>
