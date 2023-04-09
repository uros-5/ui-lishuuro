<template>
  <vari id="vari69">
    <vari-move
      @click="selectSan(index)"
      v-for="(i, index) in store.analysisMoves"
      :key="i"
      ply=""
      :class="{ active: index == store.currentIndex() }"
    >
      <san>{{ sanFormat(i) }}</san>
    </vari-move>
  </vari>
</template>

<script setup lang="ts">
import { useShuuroStore } from "@/store/useShuuroStore";

let store = useShuuroStore();

function sanFormat(fen: string) {
  let parts = fen.split(" ");
  return `${parts[3]}. ${parts[5]} `;
}

function selectSan(index: number) {
  if (index == 0) {
    store.analysisMoves = [];
    store.fastForward();
  } else {
    // store.analysisMoves.splice(index + 1);
    let fen = store.analysisMoves[index];
    store.setFightWasm(fen, true);
    store.current_index = index;
  }
}
</script>

<style scoped>
vari-move.active,
move.active {
  background-color: var(--blue-active);
}

vari-move {
  padding-left: 4px;
  cursor: pointer;
}
</style>
