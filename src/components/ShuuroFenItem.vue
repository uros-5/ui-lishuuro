<template>
  <div v-if="index! % 2 == 1" class="move counter">
    {{ Math.floor(index! / 2 + 1) }}
  </div>

  <div
    class="move"
    :class="{ active: shuuroStore.current_index == index! - 1 }"
    :ply="index"
    @click="updateIndex"
  >
    <san>{{ m() }}</san>
    <eval :id="`ply${index!}`" />
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import { useShuuroStore } from "@/store/useShuuroStore";
import { deploySfen, fightSfen } from "@/plugins/fen";

const props = defineProps<{ index: number; fen: string; move: string }>();
const shuuroStore = useShuuroStore();

function updateIndex(): void {
  shuuroStore.current_index = props.index - 1;
  if (shuuroStore.client_stage == 1) {
    let sfen = deploySfen(props.fen);
    shuuroStore.tempWasm(sfen);
  } else if (shuuroStore.client_stage == 2) {
    let sfen = fightSfen(props.fen);
    shuuroStore.tempWasm(sfen);
  }
}

function m(): string {
  if (shuuroStore.client_stage == 2) {
    return props.move.split("_")[1];
  }
  return props.move;
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
