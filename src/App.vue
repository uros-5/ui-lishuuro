<script setup lang="ts">
import { useRoute } from "vue-router";
import Header from "@/components/Header.vue";
import { ws } from "@/plugins/webSockets";

const route = useRoute();

function cssVariable(): string {
  let c;
  if (route.fullPath.startsWith("/shuuro")) {
    c = "auto";
  } else {
    c = "1300px";
  }
  return `--main-max-width: ${c};`;
}
</script>

<template>
  <Header />
  <div id="main-wrap" :style="cssVariable()">
    <router-view />
  </div>
</template>

<style></style>
