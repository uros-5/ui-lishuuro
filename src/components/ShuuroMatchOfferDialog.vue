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
import { useWs } from "@/store/useWs";
import { useGameStore } from "@/store/game";

const { SEND } = useWs();

const gameStore = useGameStore();

function canDraw() {
  return gameStore.player().isPlayer && gameStore.offeredDraw;
}

function rejectDraw() {
  gameStore.rejectDraw();
}

function acceptDraw() {
  SEND({
    t: "live_game_draw",
    game_id: gameStore.state._id,
    variant: gameStore.state.variant,
  });
  rejectDraw();
}
</script>

<style scoped>
.icon:hover {
  cursor: pointer;
}
</style>
