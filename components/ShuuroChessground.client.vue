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
  ></div>
</template>

<script setup lang="ts">
import { FenBtn } from "utils/fen";

const gameStore = useGameStore();
const analyzeStore = useAnalyzeStore();
const cgStore = useCgStore();
const settings = useHeaderSettings();

const element = ref(undefined as HTMLElement | undefined);
let counter = 0;
const keys = getKeys();

function getKeys() {
  let keys = new Map<string, FenBtn>();
  keys.set("ArrowLeft", FenBtn.Previous);
  keys.set("ArrowRight", FenBtn.Next);
  keys.set("ArrowUp", FenBtn.First);
  keys.set("ArrowDown", FenBtn.Last);
  return keys;
}

function findFen(btn: FenBtn) {
  analyzeStore.isActive() && analyzeStore.moves().length > 0
    ? analyzeStore.findFen(btn)
    : gameStore.findFen(btn);
}

function wheel(event: WheelEvent) {
  const btn = event.deltaY >= 0 ? FenBtn.Next : FenBtn.Previous;
  findFen(btn);
}

function updateElement(force?: boolean) {
  console.log("jea");
  if (counter < 3 || force) {
    counter += 1;
    if (counter == 3 || force) {
      cgStore.newElement(element.value, CgElement.Main);
    }
  }
}

function navigate(event: KeyboardEvent) {
  event.preventDefault();
  const btn = keys.get(event.key);
  if (btn != undefined) {
    findFen(btn);
  }
}

onMounted(() => {
  updateElement(true);
  document.addEventListener("keydown", navigate);
});

onUnmounted(() => {
  element.value = undefined;
  cgStore.newElement(undefined, CgElement.Main);
  cgStore.state.cg = undefined;
  document.removeEventListener("keydown", navigate);
});

onUpdated(() => {
  updateElement(true);
});
</script>

<style>
.chessground12 {
  padding-bottom: 100%;
}
.chessground12 cg-board {
  background-image: url("public/board/12x12brown.svg");
}

.chessground12 .standard8 cg-board {
  background-image: url("public/board/8x8brown.svg");
}
</style>
