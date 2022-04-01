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
  let now = shuuroStore.$state.flipped_board;
  shuuroStore.$state.flipped_board = !now;
}

function fastBackward(): void {
  shuuroStore.$state.current_index = 0;
  console.log(shuuroStore.$state.shopHistory![shuuro_store.$state.current_index]);
}

function stepBackward(): void {
  if (shuuroStore.$state.current_index > 0) {
    shuuroStore.$state.current_index -= 1;
  }
  console.log(shuuroStore.$state.shopHistory![shuuro_store.$state.current_index]);
}

function stepForward(): void {
  let history = currentHistory();
  let index = shuuroStore.$state.current_index;
  if (index+1 < history.length) {
    shuuroStore.$state.current_index += 1;
  }
  console.log(shuuroStore.$state.shopHistory![shuuro_store.$state.current_index]);
}

function fastForward(): void {
  let history = currentHistory();
  shuuroStore.$state.current_index = history.length-1; 
  console.log(shuuroStore.$state.shopHistory![shuuro_store.$state.current_index]);
}

function currentHistory(): string[] {
  if (shuuroStore.$state.client_stage == "shop") {
    return shuuroStore.$state.shop_history!;
  }
  else if (shuuroStore.$state.client_stage == "deploy") {
    return shuuroStore.$state.deploy_history!;
  }
  else if (shuuroStore.$state.client_stage == "fight"){
    return shuuroStore.$state.fight_history!;
  }
  return [];
}

</script>
<style></style>
