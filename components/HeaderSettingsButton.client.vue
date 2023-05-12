<template>
  <button class="back">
    <back
      class="icon icon-left capitalize"
      @click="(store.clicked = ''), (store.show = true)"
      >{{ store.clicked }}</back
    >
  </button>
</template>

<script setup lang="ts">
import { useHeaderSettings } from "stores/headerSettings";

const store = useHeaderSettings();
</script>

<style>
.capitalize {
  text-transform: capitalize;
}
</style>
