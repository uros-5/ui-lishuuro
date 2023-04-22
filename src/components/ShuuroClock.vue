<template>
  <div :class="`info-wrap${part}`">
    <div class="clock-wrap">
      <div :id="`clock${part}`">
        <div
          class="clock"
          :class="{
            running: field(ClockField.Running),
            hurry: field(ClockField.Hurry),
          }"
        >
          <div class="clock-time min">
            {{ field(ClockField.Min) }}
          </div>
          <div class="clock-sep low">:</div>
          <div class="clock-time sec">
            {{ field(ClockField.Sec) }}
          </div>
          <div class="clock-time byo">+{{ 15 }}s</div>
        </div>
      </div>
      <div id="more-time" />
      <div id="`berserk${part}`" />
    </div>
    <div :id="`misc-info${part}`" />
  </div>
</template>
<script setup lang="ts">
import { useClockStore } from "@/store/game/useClockStore";
import { defineProps } from "vue";

const clockStore = useClockStore();

const props = defineProps<{
  color: string;
  part: string;
}>();

enum ClockField {
  Min,
  Sec,
  Running,
  Hurry,
}

function field(field: ClockField) {
  let id = props.color == "white" ? 0 : 1;
  switch (field) {
    case ClockField.Min:
      return clockStore.state().clocks[id].currentMin;
    case ClockField.Sec:
      return clockStore.state().clocks[id].currentSec;
    case ClockField.Running:
      return clockStore.state().clocks[id].running;
    case ClockField.Hurry:
      return clockStore.state().clocks[id].hurry;
  }
}
</script>
<style></style>
