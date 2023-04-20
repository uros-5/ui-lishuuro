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
import { useGameStore } from "@/store/game";
import { useWs } from "@/store/useWs";

const store = useGameStore();
const { SEND } = useWs();

function canDR(): boolean {
  return store.state.status < 0 && store.player.isPlayer;
}

function draw() {
  let d = confirm("Are you sure you want to draw?");
  if (d) {
    SEND({
      t: "live_game_draw",
      game_id: store.state._id,
      variant: store.state.variant,
    });
  }
}

function resign() {
  let r = confirm("Are you sure you want to resign?");
  if (r) {
    SEND({
      t: "live_game_resign",
      game_id: store.state._id,
      variant: store.state.variant,
    });
  }
}
</script>

<style></style>
