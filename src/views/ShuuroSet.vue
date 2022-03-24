<template>
  <div class="chessground12"></div>
  <!--
  <div class="cg-wrap cg-512 orientation-white shuuro-board manipulable">
    <cg-container :style="setStyle()">
      <cg-board> </cg-board>
    </cg-container>
  </div>
--></template>
<script setup lang="ts">
import Chessground from "@/plugins/chessground";
import { Config } from "@/plugins/chessground/config";
import { useBoardSize } from "@/store/useBoardSize";
import { useShuuroStore } from "@/store/useShuuroStore";
import { onMounted } from "vue";

onMounted(() => {
  const elem = document.querySelector(".chessground12") as HTMLElement;
  const config: Config = { drawable: { enabled: true, visible: true } };
  const ground = Chessground(elem, config);
  let m = new Map();
  m.set("a1", { role: "l-piece", color: "black"})
  ground.setPlinths(m);
  m = new Map();
  m.set("a1", { role: "n-piece", color: "white"})
  m.set("a4", {role: "b-piece", color: "white"});
  ground.setPieces(m);
  //ground.state.pieces.set("a1", { role: "l-piece", color: "white"})
  console.log(ground);
});

const store = useBoardSize();
const shuuroStore = useShuuroStore();

store.updateRowsAndCols(12);
shuuroStore.updateClientStage("deploy");

function setStyle(): string {
  let height = store.$state.height;
  return `width: ${height}px; height: ${height}px;`;
}
</script>

<style>
.chessground12 {
	padding-bottom: 100%;
}
.chessground12 cg-board {
  background-image: url("@/assets/board/12x12brown.svg");
}
/*
.shuuro-board cg-board {
  background-image: url("@/assets/board/12x12brown.svg");
}
*/
</style>
