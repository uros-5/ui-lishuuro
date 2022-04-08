<template>
  <div
    v-if="index! % 2 == 1"
    class="move counter"
  >
    {{ Math.floor((index! /2) +1) }}
  </div>

  <div
    class="move"
    :class="{active: shuuroStore.$state.current_index == index!-1}"
    :ply="index"
    @click="updateIndex"
  >
    <san>{{ fen }}</san><eval :id="`ply${index!}`" />
  </div>
</template>

<script setup lang="ts">
import { useShuuroStore } from "@/store/useShuuroStore";

const props = defineProps({ index: Number, fen: String });
const shuuroStore = useShuuroStore();

function updateIndex(): void {
  shuuroStore.$state.current_index = props.index! - 1;
}
</script>

<style>
.move.counter {
  color: Gray;
  flex: 0 0 13%;
  background-color: var(--bg-color2);
  text-align: center;
}

.move {
  line-height: 1.9em;
  float: left;
  flex: 0 0 43.5%;
  padding-left: 6px;
  box-sizing: border-box;
  justify-content: center;
}

.move:hover {
  color: var(font-color);
  background-color: var(--blue-hover);
}

.move.active {
  background-color: var(--blue-active);
}
</style>
