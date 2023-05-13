<script setup lang="ts">
useHead({
  link: [
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap",
    },
    { rel: "stylesheet", href: "/chessground.css" },
    { rel: "stylesheet", href: "/standard.css" },
    { rel: "stylesheet", href: "/extensions.css" },
    { rel: "stylesheet", href: "/style.css" },
    { rel: "stylesheet", href: "/site.css" },
    { rel: "stylesheet", href: "/lobby.css" },
    { rel: "stylesheet", href: "/news.css" },
  ],
});

useSeoMeta({
  ogImage: "/lishuuro-tile-wide.png",
  twitterImage: "/lishuuro-tile.png",
  twitterCard: "summary",
});

const route = useRoute();

function cssVariable(): string {
  let c;
  if (route == undefined) return "";
  else if (route.fullPath.includes("/0")) {
    c = "1300px";
    return `--main-max-width: ${c};`;
  } else if (route.fullPath.startsWith("/shuuro")) {
    return "";
  } else {
    c = "1300px";
  }
  return `--main-max-width: ${c};`;
}
</script>

<template>
  <MainHeader />
  <div id="main-wrap" :style="cssVariable()">
    <NuxtLayout><NuxtPage /></NuxtLayout>
  </div>
  <ServerConnection />
</template>

<style>
.list-enter-active,
.list-leave-active {
  transition: opacity 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
}
</style>
