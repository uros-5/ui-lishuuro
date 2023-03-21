<template>
  <div id="btn-controls-top" class="btn-controls">
    <button id="flip" @click="flipSide()">
      <i class="icon icon-refresh" /></button
    ><button @click="fastBackward">
      <i class="icon icon-fast-backward" /></button
    ><button @click="stepBackward">
      <i class="icon icon-step-backward" /></button
    ><button @click="stepForward">
      <i class="icon icon-step-forward" />
    </button>
    <button @click="shuuroStore.fastForward">
      <i class="icon icon-fast-forward" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { useShuuroStore } from "../store/useShuuroStore";
const shuuroStore = useShuuroStore();

function flipSide(): void {
  let now = shuuroStore.flipped_board;
  shuuroStore.flipped_board = !now;
  if (shuuroStore.current_stage == 1) {
    shuuroStore.cgs(1).toggleOrientation();
  } else if (shuuroStore.current_stage == 2) {
    shuuroStore.cgs(2).toggleOrientation();
  }
}

function fastBackward(): void {
  shuuroStore.current_index = 0;
  if (shuuroStore.fenExist(shuuroStore.currentIndex())) {
    let placement_index = shuuroStore.myHistory(1).length - 1;
    let fen =
      shuuroStore.client_stage == 1
        ? shuuroStore.getFen(0)
        : shuuroStore.getFen(placement_index, 1);
    wasmFen(fen);
    shuuroStore.current_index = -1;
  }
}

function stepBackward(): void {
  if (shuuroStore.currentIndex() == 0) {
    fastBackward();
  } else if (shuuroStore.currentIndex() > 0) {
    shuuroStore.current_index! -= 1;
    if (shuuroStore.fenExist(shuuroStore.currentIndex())) {
      let fen = shuuroStore.getFen(shuuroStore.currentIndex());
      wasmFen(fen);
    }
  }
}

function stepForward(): void {
  let history = shuuroStore.getHistory();
  let index = shuuroStore.current_index!;
  if (index + 1 < history.length) {
    shuuroStore.current_index! += 1;
    if (shuuroStore.fenExist(shuuroStore.currentIndex())) {
      let fen = shuuroStore.getFen(shuuroStore.currentIndex());
      wasmFen(fen);
    }
  }
}

function wasmFen(fen: string) {
  shuuroStore.tempWasm(fen);
}
</script>
<style></style>
