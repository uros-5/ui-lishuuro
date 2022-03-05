<template>
  <div :class="`info-wrap${part}`">
    <div class="clock-wrap">
      <div id="`clock${part}`">
        <div class="clock">
          <div class="clock-time min">{{ min }}</div>
          <div class="clock-sep low">:</div>
          <div class="clock-time sec">{{ sec }}</div>
          <div class="clock-time byo">+{{ increment }}s</div>
        </div>
      </div>
      <div id="more-time"></div>
      <div id="`berserk${part}`"></div>
    </div>
    <div :id="`misc-info${part}`"></div>
  </div>
</template>
<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps({
  min: String,
  sec: String,
  increment: String,
  part: String,
});

function genInfo(): String {
  return `info-wrap${part}`;
}
</script>
<style></style>
