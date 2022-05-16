<template>
  <div class="game-info">
    <section>
      <ShuuroStageMatchInfo
        variant="Shuuro"
        :minute="shuuroStore.$state.min"
        :sec="shuuroStore.$state.incr"
        :rated="shuuroStore.$state.rated_game"
        date="*"
      />
      <ShuuroLeftSideUsername
        :player="player(0)"
        :rating="rating(player(0))"
        color="white"
      />
      <ShuuroLeftSideUsername
        :player="player(1)"
        :rating="rating(player(1))"
        color="black"
      />
    </section>
    <section class="shuuro-navigator">
      <router-link class="user-link" :to="navRoute('0')"> Shop </router-link>
      <router-link class="user-link" :to="navRoute('1')"> Deploy </router-link>
      <router-link class="user-link" :to="navRoute('2')"> Fight </router-link>
    </section>
  </div>
</template>
<script setup lang="ts">
import { useShuuroStore2 } from "@/store/useShuuroStore2";
import ShuuroLeftSideUsername from "./ShuuroLeftSideUsername.vue";
import ShuuroStageMatchInfo from "@/components/ShuuroStageMatchInfo.vue";
const shuuroStore = useShuuroStore2();

function navRoute(stage: string): string {
  return `/shuuro/${stage}/${shuuroStore.$state.game_id}`;
}

function player(index: number): string {
  return shuuroStore.$state.players[index];
}

function rating(username: string): number {
  let r = shuuroStore.$state.ratings;
  if (r != undefined) {
    return Math.floor(r[username][0]);
  }
  return 1500;
}
</script>
<style>
.shuuro-navigator {
  display: flex;
  justify-content: space-around;
}
</style>
