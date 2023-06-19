<template>
  <div class="game-info">
    <section>
      <ShuuroStageMatchInfo :variant="gameStore.state.variant" :minute="gameStore.state.min" :sec="gameStore.state.incr"
        :rated="false" date="*" />
      <ShuuroLeftSideUsername :player_username="player(0)" :rating="rating(player(0))" color="white" />
      <ShuuroLeftSideUsername :player_username="player(1)" :rating="rating(player(1))" color="black" />
    </section>
    <section class="shuuro-navigator">
      <NuxtLink class="user-link" v-if="gameStore.state.sub_variant == 100" :to="navRoute('0')">
        Selection
      </NuxtLink>
      <NuxtLink class="user-link" v-if="!isFightSubVariant()" :to="navRoute('1')">
        Deploy
      </NuxtLink>
      <NuxtLink class="user-link" :to="navRoute('2')"> Fight </NuxtLink>
    </section>
  </div>
</template>
<script setup lang="ts">
import { useGameStore } from "stores/game";
const gameStore = useGameStore();

function navRoute(stage: string): string {
  return `/shuuro/${gameStore.state._id}-${stage}`;
}

function player(index: number): string {
  return gameStore.state.players[index];
}

function rating(username: string): number {
  return 1500;
}

function isFightSubVariant(): boolean {
  let subVariant = gameStore.state.sub_variant;
  return [0, 1, 2].includes(subVariant);
}
</script>
<style>
.shuuro-navigator {
  display: flex;
  justify-content: space-around;
}
</style>
