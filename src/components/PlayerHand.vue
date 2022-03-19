<template>
  <div class="cg-wrap pocket" :style="inCenter ? '' : cgWidth()">
    <div
      id="pocket0"
      :style="`--pocketLength: ${6};
      --files: ${files()};
      --ranks: ${files()};
      ${cgWidth()}`"
      :class="pocketCss()"
    >
      <piece
        v-for="(i, index) in pieces"
        :class="`${color} ${i} ${handType}`"
        :data-color="color"
        :data-role="i"
        :data-nb="dataNb(index)"
        :data-max="dataMax[index]"
        @click="increment(index, i[0])"
      >
      </piece>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useBoardSize } from "@/store/useBoardSize";
import { useShuuroStore } from "@/store/useShuuroStore";
import { pieces, dataMax } from "@/store/useShuuroStore";

onMounted(() => {
  let element = document.querySelector("#mainboard") as HTMLElement;
  boardSize.updateHeight(element.offsetWidth);
});

const props = defineProps<{
  color: string;
  handType: string;
  counter: Number[];
  inCenter: boolean;
  side: string;
}>();
const boardSize = useBoardSize();
const shuuroStore = useShuuroStore();
window.addEventListener("resize", boardSize.resize, true);

function cgWidth(): string {
  return boardSize.genVars();
}

function pieceCounter(): Number[] {
  if (props.handType == "shop") {
    // read from shop
    return shuuroStore.$state.pieceCounter!;
  } else {
    // read from props
    return props.counter!.slice().splice(1);
  }
}

function dataNb(index: number): Number | string {
  let counter = pieceCounter()[index];
  if (counter == 0 && props.handType == "shop") {
    // only shop has plus
    return "+";
  }
  return counter;
}

function increment(index: number, p: string): void {
  if (props.handType == "shop" && shuuroStore.$state.amIPlayer == true) {
    if (props.color == "white") {
      p = p.toUpperCase();
    } else {
      p = p.toLowerCase();
    }
    shuuroStore.buy(p, props.color);
    scrollToBottom();
  }
}

function scrollToBottom(): void {
  const container = document.querySelector("#movelist");
  container!.scrollTop = container!.scrollHeight;
}


function localPieces(): string[] {
  let pieces2 = pieces.slice();
  return props.handType == "shop" ? pieces : pieces2.splice(1);
}

function pocketCss(): string {
	return `pocket ${props.side} usable`;
}

function files(): number {
    return props.handType == "shop" ? 8 : 10;
}
</script>

<style scoped></style>
