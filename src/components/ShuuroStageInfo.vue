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
        :player="shuuroStore.$state.players[0]"
        color="white"
      />
      <ShuuroLeftSideUsername
        :player="shuuroStore.$state.players[1]"
        color="black"
      />
    </section>
    <section class="shuuro-navigator">
      <router-link class="user-link" :to="navRoute('0')"> Shop </router-link>
      <router-link class="user-link" :to="navRoute('1')">
        Deploy
      </router-link>
      <router-link class="user-link" :to="navRoute('2')">
        Fight
      </router-link>
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
</script>
<style>
.shuuro-navigator {
  display: flex;
  justify-content: space-around;
}
</style>
