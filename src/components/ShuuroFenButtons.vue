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
  if (shuuroStore.current_stage == "deploy") {
    shuuroStore.deployCground().toggleOrientation();
  } else if (shuuroStore.current_stage == "fight") {
    shuuroStore.fightCground().toggleOrientation();
  }
}

function fastBackward(): void {
  shuuroStore.$state.current_index = 0;
  if (fenExist(shuuroStore.currentIndex())) {
    let fen = getFen(shuuroStore.currentIndex());
  console.log(fen);
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
  if (shuuroStore.$state.current_stage! == "deploy") {
    shuuroStore.tempDeployWasm(fen);
  } else if (shuuroStore.$state.current_stage! == "fight") {
    shuuroStore.tempFightWasm(fen);
  }
}

function currentHistory(): [string, number][] {
  if (shuuroStore.$state.client_stage == "shop") {
    return shuuroStore.$state.shop_history!;
  } else if (shuuroStore.$state.client_stage == "deploy") {
    return shuuroStore.$state.deploy_history!;
  } else if (shuuroStore.$state.client_stage == "fight") {
    return shuuroStore.$state.fight_history!;
  }
  return [];
}

function getFen(index: number): string {
  switch (shuuroStore.$state.client_stage!) {
    case "deploy":
      return shuuroStore.$state.deploy_history![index][0];
    case "fight":
      return shuuroStore.$state.fight_history![index][0];
    default:
      return "";
  }
}

function fenExist(index: number): boolean {
  if (shuuroStore.$state.client_stage == "deploy") {
    return index <= shuuroStore.$state.deploy_history!.length;
  } else if (shuuroStore.$state.client_stage == "fight") {
    return index <= shuuroStore.$state.fight_history!.length;
  }
  return true;
}
</script>
<style></style>
