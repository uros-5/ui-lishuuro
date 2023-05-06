<template>
  <div class="btn-controls">
    <div></div>
    <div></div>
    <button id="draw" @click="draw" v-if="canDR()" title="Draw">
      <i>½</i>
    </button>
    <button id="resign" v-if="canDR()" @click="resign" title="Resign">
      <i class="icon icon-flag-o"></i>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from "stores/game";
import { useWs } from "stores/useWs";

const gameStore = useGameStore();
const { SEND } = useWs();

function canDR(): boolean {
  return gameStore.state.status < 0 && gameStore.player().isPlayer;
}

function draw() {
  let d = confirm("Are you sure you want to draw?");
  if (d) {
    SEND({
      t: "live_game_draw",
      game_id: gameStore.state._id,
      variant: gameStore.state.variant,
    });
  }
}

function resign() {
  let r = confirm("Are you sure you want to resign?");
  if (r) {
    SEND({
      t: "live_game_resign",
      game_id: gameStore.state._id,
      variant: gameStore.state.variant,
    });
  }
}
</script>

<style></style>
