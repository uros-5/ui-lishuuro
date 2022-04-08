<template>
  <div :class="`info-wrap${part}`">
    <div class="clock-wrap">
      <div @click="shuuroStore.switchClock()" :id="`clock${part}`">
        <div class="clock" :class="{ running: isRunning() }">
          <div class="clock-time min">{{ min() }}</div>
          <div class="clock-sep low">:</div>
          <div class="clock-time sec">{{ sec() }}</div>
          <div class="clock-time byo">+{{ shuuroStore.$state.incr }}s</div>
        </div>
      </div>
      <div id="more-time"></div>
      <div id="`berserk${part}`"></div>
    </div>
    <div :id="`misc-info${part}`"></div>
  </div>
</template>
<script setup lang="ts">
import { ref, defineProps } from "vue";
import { stringifyQuery } from "vue-router";
import { useShuuroStore } from "@/store/useShuuroStore";

const props = defineProps<{
  color: String;
  part: String;
}>();

const shuuroStore = useShuuroStore();

function min(): string {
  if (props.color == "white") {
    return shuuroStore.$state.white_clock.currentMin;
  } else if (props.color == "black") {
    return shuuroStore.$state.black_clock.currentMin;
  }
  return "";
}

function sec(): string {
  if (props.color == "white") {
    return shuuroStore.$state.white_clock.currentSec;
  } else if (props.color == "black") {
    return shuuroStore.$state.black_clock.currentSec;
  }
  return "";
}

function isRunning(): boolean {
  if (props.color == "white") {
    return shuuroStore.$state.white_clock.running;
  } else if (props.color == "black") {
    return shuuroStore.$state.black_clock.running;
  }
  return false;
}

function genInfo(): string {
  return `info-wrap${props.part}`;
}
</script>
<style></style>
