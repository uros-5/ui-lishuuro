<template>
  <div class="player-data">
    <i-side class="icon" :class="cssColor()"></i-side
    ><player
      ><a class="user-link" href="/@/u"
        ><player-title class="player-now"> </player-title>{{ player
        }}<span></span></a
    ></player>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  player: String,
  color: String,
});
function cssColor(): string {
  return `icon-${props.color}`;
}
</script>

<style scoped>
.player-now {
  padding-right: 0.35em;
}
</style>
