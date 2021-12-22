<template>
  <div class="shuuro-shop__clock">{{ text }}</div>
</template>

<script setup lang="ts">
const props = defineProps({ text: String });
</script>

<style scoped>
@font-face {
  font-family: digital7;
  src: url("@/assets/fonts/digital-7.ttf");
}

.shuuro-shop__clock {
  grid-area: clock;
  border: 1px solid black;
  font-size: 2.75em;
  padding: 0.5em;
  color: white;
  background-color: var(--primary-darker);
  box-shadow: rgba(147, 147, 147, 0.2) 0px 7px 29px 0px;
  border-radius: 0.25em;
  border-top: 1px solid var(--primary-dark);
  font-family: digital7;
}
</style>
