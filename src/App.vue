<script setup lang="ts">
import { useRoute } from "vue-router";
import Header from "@/components/Header.vue";
import ServerConnection from "@/components/ServerConnection.vue";

const route = useRoute();

function cssVariable(): string {
  let c;
  if (route == undefined) return "";
  else if (route.fullPath.startsWith("/shuuro/0")) {
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
  <Header />
  <div id="main-wrap" :style="cssVariable()">
    <router-view v-slot="{ Component }">
      <transition name="list">
        <component :is="Component" />
      </transition>
    </router-view>
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
