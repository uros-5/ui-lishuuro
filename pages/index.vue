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
const keywords =
  "lishuuro, shuuro chess, play shuuro, how to play shuuro, lichess, lichess fork";
useHead({
  title: headTitle("Home"),
  meta: [
    {
      name: "description",
      content: "Play Shuuro game - interesting chess variant",
    },
    { name: "keywords", content: keywords },
  ],
});
</script>

<style>
:root {
  --main-max-width: 1300px;
}
</style>
