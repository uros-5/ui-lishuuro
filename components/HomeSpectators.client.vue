<template>
  <div class="under-right">
    <NuxtLink to="/players">
      <span id="u_cnt">{{ user.plCount }} players</span>
    </NuxtLink>
    <NuxtLink to="/tv">
      <span id="g_cnt">{{ user.gamesCount }} games in play</span>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { useUser } from "stores/useUser";
const { user } = useUser();
</script>

<style scoped>
.under-right {
  grid-area: utable;
  flex: 1;
  display: flex;
  flex-flow: column nowrap;
}
</style>
