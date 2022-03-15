<template>
  <div class="game-info">
    <section>
      <ShuuroStageMatchInfo
        variant="Shuuro"
        :minute="store.$state.min"
        :sec="store.$state.incr"
        date="*"
      />
      <ShuuroLeftSideUsername :player="store.$state.white" color="white" />
      <ShuuroLeftSideUsername :player="store.$state.black" color="black" />
    </section>
    <section class="shuuro-navigator">
      <router-link class="user-link" :to="navRoute('shop')">Shop</router-link>
      <router-link class="user-link" :to="navRoute('set')"
        >Deploy</router-link
      >
      <router-link class="user-link" :to="navRoute('play')">Fight</router-link>
    </section>
  </div>
</template>
<script setup lang="ts">
import { useShuuroStore } from "@/store/useShuuroStore";
import ShuuroLeftSideUsername from "./ShuuroLeftSideUsername.vue";
import ShuuroStageMatchInfo from "@/components/ShuuroStageMatchInfo.vue";
const store = useShuuroStore();

function navRoute(stage: string): string {
  return `/shuuro/${stage}/${store.$state.gameId}`;
}
</script>
<style>
.shuuro-navigator {
  display: flex;
  justify-content: space-around;
}
</style>
