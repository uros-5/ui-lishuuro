<template>
  <div
    id="chessground12"
    class="chessground12"
    ref="element"
    :class="{ standard8: gameStore.state.variant.startsWith('standard') }"
    :data-board="settings.getBoard()"
    :data-piece="settings.getPiece()"
    :data-size="settings.getVariant(gameStore.state.variant)"
  />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { useHeaderSettings } from "@/store/headerSettings";
import { useGameStore } from "@/store/game";
import { useCgStore } from "@/store/game/useCgStore";

const { gameStore } = useGameStore();
const { cgStore } = useCgStore();
const settings = useHeaderSettings();
const element = ref(null);

onMounted(() => {
  cgStore.newElement(element.value, 0);
});

onUnmounted(() => {
  element.value = null;
  cgStore.newElement(element.value, 0);
});
</script>

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
