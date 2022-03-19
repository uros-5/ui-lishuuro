<template>
  <div id="btn-controls-top" class="btn-controls">
    <button id="flip" @click="flipSide()"><i class="icon icon-refresh"></i></button
    ><button @click="fastBackward"><i class="icon icon-fast-backward"></i></button
    ><button @click="stepBackward"><i class="icon icon-step-backward"></i></button
    ><button @click="stepForward"><i class="icon icon-step-forward"></i></button>
    <button @click="fastForward"><i class="icon icon-fast-forward"></i></button>
  </div>
</template>
<script setup lang="ts">
import { useShuuroStore } from '../store/useShuuroStore';
const shuuroStore = useShuuroStore();

function flipSide(): void {
  let now = shuuroStore.$state.flippedBoard;
  shuuroStore.$state.flippedBoard = !now;
}

function fastBackward(): void {
  shuuroStore.$state.currentIndex = 0;
  console.log(shuuroStore.$state.shopHistory![shuuroStore.$state.currentIndex]);
}

function stepBackward(): void {
  if (shuuroStore.$state.currentIndex > 0) {
    shuuroStore.$state.currentIndex -= 1;
  }
  console.log(shuuroStore.$state.shopHistory![shuuroStore.$state.currentIndex]);
}

function stepForward(): void {
  let history = currentHistory();
  let index = shuuroStore.$state.currentIndex;
  if (index+1 < history.length) {
    shuuroStore.$state.currentIndex += 1;
  }
  console.log(shuuroStore.$state.shopHistory![shuuroStore.$state.currentIndex]);
}

function fastForward(): void {
  let history = currentHistory();
  shuuroStore.$state.currentIndex = history.length-1; 
  console.log(shuuroStore.$state.shopHistory![shuuroStore.$state.currentIndex]);
}

function currentHistory(): string[] {
  if (shuuroStore.$state.clientStage == "shop") {
    return shuuroStore.$state.shopHistory!;
  }
  else if (shuuroStore.$state.clientStage == "deploy") {
    return shuuroStore.$state.deployHistory!;
  }
  else if (shuuroStore.$state.clientStage == "fight"){
    return shuuroStore.$state.fightHistory!;
  }
  return [];
}

</script>
<style></style>
