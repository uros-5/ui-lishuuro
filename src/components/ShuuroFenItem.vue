<template>
  <div v-if="index % 2 == 1 && !isFirst()" class="move counter">
    {{ Math.floor(index / 2 + 1) }}
  </div>

  <div
    class="move"
    :class="{ active: gameStore.index() == index - 1 }"
    :ply="index"
    @click="updateIndex"
    v-if="!isFirst()"
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
const gameStore = useGameStore();

function updateIndex(): void {
  gameStore.other.index = props.index - 1;
  audio();
}

function isFirst(): boolean {
  if ([1, 2].includes(gameStore.clientStage())) {
    if (props.index - 1 == 0) {
      return true;
    }
  }
  return false;
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
