<script setup lang="ts">
useHead({
  bodyAttrs: {
    "data-theme": "dark",
  },
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
</script>

<template>
  <MyApp />
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
