<template>
  <div
    id="chessground12"
    class="chessground12"
    ref="element"
    :class="{ standard8: gameStore.state.variant.startsWith('standard') }"
    :data-board="settings.getBoard()"
    :data-piece="settings.getPiece()"
    :data-size="settings.getVariant(gameStore.state.variant)"
    @wheel.prevent="wheel"
  />
</template>

<script setup lang="ts">
import {
  onMounted,
  onUnmounted,
  onUpdated,
  onBeforeUnmount,
  ref,
  watch,
} from "vue";
import { useHeaderSettings } from "@/store/headerSettings";
import { useGameStore } from "@/store/game";
import { CgElement, useCgStore } from "@/store/game/useCgStore";
import { FenBtn } from "@/plugins/fen";

const gameStore = useGameStore();
const cgStore = useCgStore();
const settings = useHeaderSettings();
const element = ref(undefined as HTMLElement | undefined);

let counter = 0;
let mounted = false;

function wheel(event: WheelEvent) {
  const btn = event.deltaY >= 0 ? FenBtn.Next : FenBtn.Previous;
  gameStore.findFen(btn);
}

function updateElement(force?: boolean) {
  if ((counter < 6 && mounted) || force == true) {
    cgStore.newElement(element.value, CgElement.Main);
    counter += 1;
  }
}

onMounted(() => {
  mounted = true;
  updateElement(true);
});

watch(element, (state) => {
  updateElement();
});

onUnmounted(() => {
  element.value = undefined;
  cgStore.newElement(undefined, CgElement.Main);
  cgStore.state.cg = undefined;
  mounted = false;
});

onBeforeUnmount(() => {
  // cgStore.newElement(undefined, 0);
});

onUpdated(() => {
  updateElement();
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
