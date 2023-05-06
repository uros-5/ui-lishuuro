<script setup lang="ts">
import { useWs } from "#imports";

const { SEND } = useWs();
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
  <ClientOnly>
    <MainHeader />
    <div id="main-wrap" :style="cssVariable()">
      <NuxtPage />
    </div>
    <ServerConnection />
  </ClientOnly>
</template>

<style></style>
