<template>
  <div v-if="index! % 2 == 1 && index != 1" class="move counter">
    {{ Math.floor(index! / 2 + 1) }}
  </div>

  <div
    class="move"
    v-if="index != 1"
    :class="{ active: gameStore.index().value == index! - 1 }"
    :ply="index"
    @click="updateIndex"
  >
    <san>{{ m() }}</san>
    <eval :id="`ply${index!}`" />
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import { deploySfen, fightSfen } from "@/plugins/fen";
import { useGameStore } from "@/store/game";
import { playAudio } from "@/plugins/audio";

const props = defineProps<{ index: number; fen: string; move: string }>();
const { gameStore } = useGameStore();

function updateIndex(): void {
  audio();
}

function audio() {
  if (props.move.includes("x")) {
    playAudio("capture");
  } else {
    playAudio("move");
  }
}

function m(): string {
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
  font-weight: bold;
}
</style>
