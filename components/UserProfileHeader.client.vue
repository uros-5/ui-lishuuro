<template>
  <div class="player-head">
    <h1 class="player">
      <NuxtLink class="user-link" :to="`/@/${props.username}`"
        ><player-title></player-title>
        {{ props.username }}
      </NuxtLink>
    </h1>
    <div class="trophies"></div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{ username: string }>();
</script>
<style></style>
