<template>
  <div class="game-info">
    <section>
      <ShuuroStageMatchInfo
        :variant="shuuroStore.getVariant()"
        :minute="shuuroStore.min"
        :sec="shuuroStore.incr"
        :rated="shuuroStore.rated_game"
        date="*"
      />
      <ShuuroLeftSideUsername
        :player_username="player(0)"
        :rating="rating(player(0))"
        color="white"
      />
      <ShuuroLeftSideUsername
        :player_username="player(1)"
        :rating="rating(player(1))"
        color="black"
      />
    </section>
    <section class="shuuro-navigator">
      <router-link
        class="user-link"
        v-if="shuuroStore.getSubVariant() == 100"
        :to="navRoute('0')"
      >
        Shop
      </router-link>
      <router-link
        class="user-link"
        v-if="!isFightSubVariant()"
        :to="navRoute('1')"
      >
        Deploy
      </router-link>
      <router-link class="user-link" :to="navRoute('2')"> Fight </router-link>
    </section>
  </div>
</template>
<script setup lang="ts">
import { useShuuroStore } from "@/store/useShuuroStore";
import ShuuroLeftSideUsername from "./ShuuroLeftSideUsername.vue";
import ShuuroStageMatchInfo from "@/components/ShuuroStageMatchInfo.vue";
const shuuroStore = useShuuroStore();

function navRoute(stage: string): string {
  return `/shuuro/${stage}/${shuuroStore.game_id}`;
}

function player(index: number): string {
  return shuuroStore.players[index];
}

function rating(username: string): number {
  let r = shuuroStore.ratings;
  return 1500;
}

function isFightSubVariant(): boolean {
  let subVariant = shuuroStore.getSubVariant();
  return [0, 1, 2].includes(subVariant);
}
</script>
<style>
.shuuro-navigator {
  display: flex;
  justify-content: space-around;
}
</style>
