<template>
  <div id="offer-dialog">
    <div class="reject" v-if="canDraw()" @click="rejectDraw()">
      <i class="icon icon-abort reject"></i>
    </div>

    <div class="text" v-if="canDraw()">Your opponent offers a draw</div>

    <div class="accept" v-if="canDraw()" @click="acceptDraw()">
      <i class="icon icon-check"></i>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useShuuroStore } from "../store/useShuuroStore";
import { SEND } from "@/plugins/webSockets";

const store = useShuuroStore();

function canDraw() {
  return store.am_i_player && store.offeredDraw!;
}

function rejectDraw() {
  store.offeredDraw = false;
}

function acceptDraw() {
  SEND({ t: "live_game_draw", game_id: store.game_id });
  store.offeredDraw = false;
}
</script>

<style scoped>
.icon:hover {
  cursor: pointer;
}
</style>
