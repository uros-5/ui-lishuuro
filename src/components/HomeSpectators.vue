<template>
  <div class="under-right">
    <router-link to="/players">
      <span id="u_cnt">{{ store.plCount }} players</span>
    </router-link>
    <router-link to="/">
      <span id="g_cnt">{{ store.gamesCount }} games in play</span>
    </router-link>
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
