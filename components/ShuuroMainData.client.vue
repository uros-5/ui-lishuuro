<template>
  <div class="material material-top black standard disabled" />
  <div class="pocket-top">
    <PlayerHand
      :in-center="false"
      side="top"
      :counter="[0, 0, 0, 0, 0, 0, 0, 0]"
      :color="getColor(topPlayer())"
      hand-type="pocket"
    />
  </div>
  <div id="expiration-top" />
  <ShuuroMatchOfferDialog />
  <ShuuroMatchButtons />
  <div id="expiration-bottom" />
  <div class="pocket-bot">
    <PlayerHand
      side="bottom"
      :in-center="false"
      :counter="[0, 0, 0, 0, 0, 0, 0, 0]"
      :color="getColor(bottomPlayer())"
      hand-type="pocket"
    />
  </div>
  <div class="material material-bottom standard disabled"></div>
</template>

<script setup lang="ts">



import { useGameStore } from "stores/game";
import { useCgStore } from "stores/game/useCgStore";

const gameStore = useGameStore();
const cgStore = useCgStore();

function topPlayer(): string {
  if (cgStore.flipped()) {
    return gameStore.state.players[0];
  } else {
    return gameStore.state.players[1];
  }
}

function bottomPlayer(): string {
  if (cgStore.flipped()) {
    return gameStore.state.players[1];
  } else {
    return gameStore.state.players[0];
  }
}

function getColor(username: string): string {
  const index = gameStore.state.players.findIndex((item) => item == username)!;
  return index == 0 ? "white" : "black";
}
</script>
