<template>
  <div class="info0 icon" :data-icon="gameIcon()">
    <div class="info2">
      <div class="tc">
        {{ minute }} + {{ sec }} • {{ ratedGame() }}•
        <NuxtLink class="user-link" to="/">{{ variantTitle() }}</NuxtLink>
      </div>
      <info-date timestamp="" :title="toolTipDate()">
        {{ gameDate() }}
      </info-date>
    </div>
  </div>
</template>
<script setup lang="ts">
import { timeago } from "utils/timeago";
import { useGameStore } from "stores/game";

const gameStore = useGameStore();

const props = defineProps<{
  variant: string;
  minute: number;
  sec: number;
  date: string;
  rated: boolean;
}>();

function variantTitle(): string {
  switch (props.variant) {
    case "shuuro":
      return "Shuuro";
    case "shuuroFairy":
      return "Shuuro Fairy";
    case "standard":
      return "Standard";
    case "standardFairy":
      return "Standard Fairy";
    default:
      return "";
  }
}

function ratedGame(): string {
  if (props.rated) {
    return "Rated";
  } else {
    return "Casual";
  }
}

function gameDate(): string {
  if (gameStore.state.status < 0) {
    return "Playing right now";
  } else {
    return timeago(gameStore.state.last_clock);
  }
}

function toolTipDate(): string {
  const d = gameStore.state.last_clock;
  if (d) {
    return gameStore.state.last_clock.toString();
  }
  return "";
}

function gameIcon(): string {
  return props.variant.endsWith("Fairy") ? "" : "M";
}
</script>
<style></style>
