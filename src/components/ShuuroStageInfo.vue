<template>
  <div class="game-info">
    <section>
      <ShuuroStageMatchInfo
        variant="Shuuro"
        :minute="shuuroStore.$state.min"
        :sec="shuuroStore.$state.incr"
        date="*"
      />
      <ShuuroLeftSideUsername
        :player="shuuroStore.$state.white"
        color="white"
      />
      <ShuuroLeftSideUsername
        :player="shuuroStore.$state.black"
        color="black"
      />
    </section>
    <section class="shuuro-navigator">
      <router-link class="user-link" :to="navRoute('shop')">Shop</router-link>
      <router-link class="user-link" :to="navRoute('set')">Deploy</router-link>
      <router-link class="user-link" :to="navRoute('play')">Fight</router-link>
    </section>
  </div>
</template>
<script setup lang="ts">
import { useShuuroStore } from "@/store/useShuuroStore";
import ShuuroLeftSideUsername from "./ShuuroLeftSideUsername.vue";
import ShuuroStageMatchInfo from "@/components/ShuuroStageMatchInfo.vue";
const shuuroStore = useShuuroStore();

function navRoute(stage: string): string {
  return `/shuuro/${stage}/${shuuroStore.$state.game_id}`;
}
</script>
<style>
.shuuro-navigator {
  display: flex;
  justify-content: space-around;
}
</style>
