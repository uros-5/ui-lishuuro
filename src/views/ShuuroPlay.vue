<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { useGameStore } from "@/store/game";
import ShuuroChessground from "@/components/ShuuroChessground.vue";

const gameStore = useGameStore();

onMounted(async () => {
  gameStore.updateStage = 2;
  if (gameStore.state._id == "") {
  } else {
  }
});

onUnmounted(() => {});
</script>

<style scoped></style>

<template>
  <ShuuroChessground />
</template>

<style>
.chessground12 {
  padding-bottom: 100%;
}

.chessground12 cg-board {
  background-image: url("@/assets/board/12x12brown.svg");
}

.chessground12 .standard8 cg-board {
  background-image: url("@/assets/board/8x8brown.svg");
}
</style>
