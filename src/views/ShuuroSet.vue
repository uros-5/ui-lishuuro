<template>
  <ShuuroChessground />
</template>
<script setup lang="ts">
import { useBoardSize } from "@/store/useBoardSize";
import { onMounted } from "vue";
import { useGameStore } from "@/store/game";
import ShuuroChessground from "@/components/ShuuroChessground.vue";

const store = useBoardSize();
const gameStore = useGameStore();

store.updateRowsAndCols(12);

onMounted(async () => {
  gameStore.newClientStage(1);
});
</script>

<style>
.chessground12 {
  padding-bottom: 100%;
}

.chessground12 cg-board {
  background-image: url("@/assets/board/12x12brown.svg");
}

.chessground12.standard8 cg-board {
  background-image: url("@/assets/board/8x8brown.svg");
}

/*
.shuuro-board cg-board {
  background-image: url("@/assets/board/12x12brown.svg");
}
*/
</style>
