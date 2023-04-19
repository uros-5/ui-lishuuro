<template>
  <div class="game-info">
    <section>
      <ShuuroStageMatchInfo
        :variant="store.state.variant"
        :minute="store.state.min"
        :sec="store.state.incr"
        :rated="false"
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
        v-if="store.state.sub_variant == 100"
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
import ShuuroLeftSideUsername from "./ShuuroLeftSideUsername.vue";
import ShuuroStageMatchInfo from "@/components/ShuuroStageMatchInfo.vue";
import { useGameStore } from "@/store/game";
const store = useGameStore();

function navRoute(stage: string): string {
  return `/shuuro/${stage}/${store.state._id}`;
}

function player(index: number): string {
  return store.state.players[index];
}

function rating(username: string): number {
  return 1500;
}

function isFightSubVariant(): boolean {
  let subVariant = store.state.sub_variant;
  return [0, 1, 2].includes(subVariant);
}
</script>
<style>
.shuuro-navigator {
  display: flex;
  justify-content: space-around;
}
</style>
