<template>
  <div class="player-data">
    <i-side class="icon" :class="cssColor()"></i-side>
    <player>
      <router-link class="user-link" :to="`/@/${player_username}`"><player-title class="player-now" />{{ player_username
      }} ({{ rating
}})<span /></router-link>
    </player>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
const props = defineProps<{
  player_username: string;
  rating: number;
  color: string;
}>();
function cssColor(): string {
  return `icon-${props.color}`;
}
</script>

<style scoped>
.player-now {
  padding-right: 0.35em;
}
</style>
