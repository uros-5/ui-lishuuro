<template>
  <div class="under-right">
    <router-link to="/players">
      <span id="u_cnt">{{ user.plCount }} players</span>
    </router-link>
    <router-link to="/tv">
      <span id="g_cnt">{{ user.gamesCount }} games in play</span>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { useUser } from "@/store/useUser";
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
