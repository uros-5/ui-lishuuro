<template>
  <div v-if="index! % 2 == 1" class="move counter">
    {{ Math.floor((index! /2) +1) }}
  </div>

  <div
    class="move"
    :class="{active: shuuroStore.$state.current_index == index!-1}"
    :ply="index"
    @click="updateIndex"
  >
    <san>{{ move }}</san
    ><eval :id="`ply${index!}`" />
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import { useShuuroStore2 } from "@/store/useShuuroStore2";
import { deploySfen, fightSfen } from "@/plugins/fen";


const props = defineProps<{ index: number; fen: string; move: string }>();
const shuuroStore = useShuuroStore2();

function updateIndex(): void {
  shuuroStore.$state.current_index = props.index! - 1;
  if (shuuroStore.$state.client_stage == 1) {
    let sfen = deploySfen(props.fen);
    shuuroStore.tempDeployWasm(sfen);
  } else if (shuuroStore.$state.client_stage == 2) {
    let sfen = fightSfen(props.fen);
    shuuroStore.tempFightWasm(sfen);
  }
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
