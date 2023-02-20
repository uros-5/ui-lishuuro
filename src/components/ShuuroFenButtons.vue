<template>
  <div id="btn-controls-top" class="btn-controls">
    <button id="flip" @click="flipSide()">
      <i class="icon icon-refresh" /></button><button @click="fastBackward">
      <i class="icon icon-fast-backward" /></button><button @click="stepBackward">
      <i class="icon icon-step-backward" /></button><button @click="stepForward">
      <i class="icon icon-step-forward" />
    </button>
    <button @click="fastForward">
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
  if (fenExist(shuuroStore.currentIndex())) {
    let placement_index = shuuroStore.myHistory(1).length - 1;
    let fen = shuuroStore.client_stage == 1 ? getFen(0) : getFen(placement_index, 1);
    wasmFen(fen);
    shuuroStore.current_index = -1;
  }
}

function stepBackward(): void {
  if (shuuroStore.currentIndex() == 0) {
    fastBackward();
  }
  else if (shuuroStore.currentIndex() > 0) {
    shuuroStore.current_index! -= 1;
    if (fenExist(shuuroStore.currentIndex())) {
      let fen = getFen(shuuroStore.currentIndex());
      wasmFen(fen);
    }
  }
}

function stepForward(): void {
  let history = shuuroStore.getHistory();
  let index = shuuroStore.current_index!;
  if (index + 1 < history.length) {
    shuuroStore.current_index! += 1;
    if (fenExist(shuuroStore.currentIndex())) {
      let fen = getFen(shuuroStore.currentIndex());
      wasmFen(fen);
    }
  }
}

function fastForward(): void {
  let history = shuuroStore.getHistory();
  shuuroStore.current_index = history.length - 1;
  if (fenExist(shuuroStore.currentIndex())) {
    let fen = getFen(shuuroStore.currentIndex());
    wasmFen(fen);
  }
}

function wasmFen(fen: string) {
  shuuroStore.tempWasm(fen);
}

function getFen(index: number, stage?: number): string {
  let client_stage = stage ? stage : shuuroStore.client_stage!;
  switch (client_stage) {
    case 1:
      let s = (shuuroStore.myHistory(1)[index] as string).split("_");
      return `${s[1]} ${s[2]} ${s[3]}`;
    case 2:
      let st = (shuuroStore.myHistory(2)![index] as string);
      return st != undefined ? st : "";
    default:
      return "";
  }
}

function fenExist(index: number): boolean {
  if (index < 0) return false;
  if (shuuroStore.client_stage == 1) {
    return index <= shuuroStore.myHistory(1)!.length;
  } else if (shuuroStore.client_stage == 2) {
    return index < shuuroStore.myHistory(2)!.length;
  }
  return false;
}
</script>
<style></style>
