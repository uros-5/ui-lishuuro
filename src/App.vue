<script setup lang="ts">
import Header from "@/components/Header.vue";
import { WS } from "@/plugins/webSockets";
let a = 111;
</script>

<template>
  <Header />
  <div id="main-wrap">
    <router-view />
  </div>
</template>

<style></style>
