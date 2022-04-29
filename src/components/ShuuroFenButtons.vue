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
    <button @click="fastForward">
      <i class="icon icon-fast-forward" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { Api } from "@/plugins/chessground/api";
import { useShuuroStore2 } from "../store/useShuuroStore2";
const shuuroStore = useShuuroStore2();

function flipSide(): void {
  let now = shuuroStore.$state.flipped_board;
  shuuroStore.$state.flipped_board = !now;
  if (shuuroStore.current_stage == 1) {
    shuuroStore.cgs(1).toggleOrientation();
  } else if (shuuroStore.current_stage == 2) {
    shuuroStore.cgs(2).toggleOrientation();
  }
}

function fastBackward(): void {
  shuuroStore.$state.current_index = 0;
  if (fenExist(shuuroStore.currentIndex())) {
    let fen = getFen(0);
    wasmFen(fen);
  }
}

function stepBackward(): void {
  if (shuuroStore.currentIndex() > 0) {
    shuuroStore.$state.current_index! -= 1;
    if (fenExist(shuuroStore.currentIndex())) {
      let fen = getFen(shuuroStore.currentIndex());
      wasmFen(fen);
    }
  }
}

function stepForward(): void {
  let history = currentHistory();
  let index = shuuroStore.$state.current_index!;
  if (index + 1 < history.length) {
    shuuroStore.$state.current_index! += 1;
    if (fenExist(shuuroStore.currentIndex())) {
      let fen = getFen(shuuroStore.currentIndex());
      wasmFen(fen);
    }
  }
}

function fastForward(): void {
  let history = currentHistory();
  shuuroStore.$state.current_index = history.length - 1;
  if (fenExist(shuuroStore.currentIndex())) {
    let fen = getFen(shuuroStore.currentIndex());
    wasmFen(fen);
  }
}

function wasmFen(fen: string) {
  shuuroStore.tempWasm(fen);
}

function currentHistory(): [string, number][] {
  if (shuuroStore.$state.client_stage == 0) {
    return shuuroStore.history(0)!;
  } else if (shuuroStore.$state.client_stage == 1) {
    return shuuroStore.history(1)!;
  } else if (shuuroStore.$state.client_stage == 2) {
    return shuuroStore.history(2)!;
  }
  return [];
}

function getFen(index: number): string {
  switch (shuuroStore.$state.client_stage!) {
    case 1:
      let s = shuuroStore.history(1)![index][0].split("_");
      return `${s[1]} ${s[2]} ${s[3]}`;
    case 2:
      return shuuroStore.history(2)![index][0];
    default:
      return "";
  }
}

function fenExist(index: number): boolean {
  if (shuuroStore.$state.client_stage == 1) {
    return index <= shuuroStore.history(1)!.length;
  } else if (shuuroStore.$state.client_stage == 2) {
    return index <= shuuroStore.history(2)!.length;
  }
  return false;
}
</script>
<style></style>
