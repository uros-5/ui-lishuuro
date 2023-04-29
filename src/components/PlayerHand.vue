<template>
  <div
    class="cg-wrap pocket"
    :data-piece="hs.getPiece()"
    :style="inCenter ? '' : cgWidth()"
  >
    <div
      v-if="isHand()"
      :id="divId()"
      style="flex-wrap: wrap"
      :style="pocketStyle()"
      :class="pocketCss()"
      ref="element"
    >
      <piece
        v-for="(i, index) in pieces(gameStore.state)"
        v-if="handType == 'shop'"
        :key="i"
        :class="`${color} ${i} ${handType}`"
        :data-color="color"
        :data-role="i"
        :data-nb="dataNb(index)"
        :data-max="dataMax(gameStore.state)[index]"
        @click="increment(index, i[0])"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  onMounted,
  defineProps,
  ref,
  onUnmounted,
  watch,
  type WatchStopHandle,
  onUpdated,
} from "vue";
import { useBoardSize } from "@/store/useBoardSize";
import { useHeaderSettings } from "@/store/headerSettings";
import { useGameStore } from "@/store/game";
import { pieces, dataMax } from "@/plugins/shop";
import { useShopStore } from "@/store/game/useShopStore";
import { CgElement, useCgStore } from "@/store/game/useCgStore";

const props = defineProps<{
  color: string;
  handType: string;
  counter: number[];
  inCenter: boolean;
  side: string;
}>();

const boardSize = useBoardSize();
const hs = useHeaderSettings();
const gameStore = useGameStore();
const shopStore = useShopStore();
const cgStore = useCgStore();

const element = ref(null as HTMLElement | null);

let watcher: WatchStopHandle;
let counter = 0;

watcher = watchElement();

function watchElement(): WatchStopHandle {
  return watch(
    element,
    (newer) => {
      cgStore.newElement(newer as HTMLElement, id());
    },
    { deep: true }
  );
}

onMounted(() => {
  let mainElement = document.querySelector("#mainboard") as HTMLElement;
  boardSize.updateHeight(mainElement.offsetWidth);
  watcher = watchElement();
});

onUnmounted(() => {
  element.value = null;
  cgStore.newElement(undefined, id());
  watcher();
});

onUpdated(() => {
  if (counter < 8) {
    cgStore.newElement(element.value as HTMLElement, id());
    counter += 1;
  } else {
  }
});

function divId() {
  return props.side == "top" ? "pocket0" : "pocket1";
}

function id(): CgElement {
  if (props.side == "top") {
    return CgElement.Top;
  } else if (props.side == "bottom") {
    return CgElement.Bot;
  }
  return CgElement.None;
}

window.addEventListener("resize", boardSize.resize, true);

function cgWidth(): string {
  return boardSize.genVars();
}

function piece_counter(): number[] {
  if (props.handType == "shop") {
    // read from shop
    return shopStore.pieceCounter() as unknown as number[];
  } else {
    // read from props
    return props.counter.slice().splice(1);
  }
}

function dataNb(index: number): number | string {
  let counter = piece_counter()[index];
  if (counter == 0 && props.handType == "shop") {
    // only shop has plus
    return "+";
  }
  return counter;
}

function increment(_index: number, p: string): void {
  if (props.handType == "shop" && gameStore.player().isPlayer == true) {
    if (props.color == "white") {
      p = p.toUpperCase();
    } else {
      p = p.toLowerCase();
    }
    shopStore.buy(p, props.color);
    scrollToBottom();
  }
}

function scrollToBottom(): void {
  const container = document.querySelector("#movelist");
  container!.scrollTop = container!.scrollHeight;
}

function pocketCss(): string {
  return `pocket ${props.side} usable`;
}

function isHand(): boolean {
  let stage = gameStore.clientStage();
  return stage == 0 || stage == 1;
}

function files(): number {
  let r = props.handType == "shop" ? 8 : 10;

  return props.handType == "pocket" && gameStore.state.variant.endsWith("Fairy")
    ? 12
    : r;
}

function pocketLength(): number {
  let variant = gameStore.state.variant;
  return variant.endsWith("Fairy") ? 9 : 6;
}

function pocketStyle(): string {
  return `--pocketLength: ${pocketLength()};
          --files: ${files()};
          --ranks: ${files()};
          ${cgWidth()}`;
}
</script>

<style scoped></style>
