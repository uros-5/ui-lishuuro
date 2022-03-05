<template>
  <div class="under-right">
    <a href="/">
      <span id="u_cnt">{{ store.$state.plCount }} players</span>
    </a>
    <a href="/">
      <span id="g_cnt">{{ store.$state.gamesCount }} games in play</span>
    </a>
  </div>
</template>

<script setup lang="ts">
import { useUser } from "@/store/useUser";
const store = useUser();
</script>

<style scoped>
.under-right {
  grid-area: utable;
  flex: 1;
  display: flex;
  flex-flow: column nowrap;
}
</style>
