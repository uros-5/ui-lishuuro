<template>
  <div class="pocket-top">
    <div class="standard-placement">
      <div class="cg-wrap pocket">
        <div
          :id="pID"
          class="pocket top usable"
          :class="part"
          :style="`--pocketLength: 5; --files: ${
            store.$state.rowsAndCols
          }; --ranks: ${store.$state.rowsAndCols}; ${store.genVars()}`"
        >
          <piece
            v-for="i in destructHand()"
            :key="i"
            :class="genClass(color, i.p)"
            :data-nb="i.nb"
          ></piece>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineProps, ref, toRefs, onMounted } from "vue";
import { useBoardSize } from "@/store/useBoardSize";

const store = useBoardSize();
const props = defineProps({
  pieces: String,
  color: String,
  pID: String,
  part: String,
});
const { pieces } = ref(props);

onMounted(() => {
  store.updateHeight(document.querySelector("#mainboard").offsetWidth);
});

function destructHand(): String {
  let hand = [
    { p: "q", nb: 0 },
    { p: "r", nb: 0 },
    { p: "b", nb: 0 },
    { p: "n", nb: 0 },
    { p: "p", nb: 0 },
  ];
  for (let i = 0; i < props.pieces.length; i++) {
    let p = props.pieces[i];
    switch (p) {
      case "q":
        hand[0].nb += 1;
        break;
      case "r":
        hand[1].nb += 1;
        break;
      case "b":
        hand[2].nb += 1;
        break;
      case "n":
        hand[3].nb += 1;
        break;
      case "p":
        hand[4].nb += 1;
        break;
    }
  }
  return hand;
}

function genClass(color: String, piece: String): String {
  return `${color[0]}${piece.toUpperCase()}`;
}

window.addEventListener("resize", store.resize, true);
</script>
<style>
button {
  padding: 0.5em;
  font-size: 1.5em;
}

.wQ {
  background-image: url("@/assets/pieces/merida/wQ.svg");
}

.wR {
  background-image: url("@/assets/pieces/merida/wR.svg");
}

.wB {
  background-image: url("@/assets/pieces/merida/wB.svg");
}

.wN {
  background-image: url("@/assets/pieces/merida/wN.svg");
}

.wP {
  background-image: url("@/assets/pieces/merida/wP.svg");
}

.bQ {
  background-image: url("@/assets/pieces/merida/bQ.svg");
}

.bR {
  background-image: url("@/assets/pieces/merida/bR.svg");
}

.bB {
  background-image: url("@/assets/pieces/merida/bB.svg");
}

.bN {
  background-image: url("@/assets/pieces/merida/bN.svg");
}

.bP {
  background-image: url("@/assets/pieces/merida/bP.svg");
}
</style>
