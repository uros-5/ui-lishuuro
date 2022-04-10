<template>
  <div class="chessground12" />
  <!--
  <div class="cg-wrap cg-512 orientation-white shuuro-board manipulable">
    <cg-container :style="setStyle()">
      <cg-board> </cg-board>
    </cg-container>
  </div>
--></template>
<script setup lang="ts">
import Chessground from "@/plugins/chessground";
import { anonConfig, liveConfig } from "@/plugins/chessground/configs";
import { readPockets, renderPocketsInitial } from "@/plugins/chessground/pocket";
import { useBoardSize } from "@/store/useBoardSize";
import { useShuuroStore2 } from "@/store/useShuuroStore2";
import { onMounted } from "vue";
import { defaults } from "@/plugins/chessground/state";
import { Api } from "@/plugins/chessground/api";
import { renderWrap } from "@/plugins/chessground/wrap";

const store = useBoardSize();
const shuuroStore = useShuuroStore2();

store.updateRowsAndCols(12);
shuuroStore.updateClientStage("deploy");

onMounted(() => {
  const elem = document.querySelector(".chessground12") as HTMLElement;
  const top = document.querySelector("#pocket0") as HTMLElement;
  const bot = document.querySelector("#pocket1") as HTMLElement;
  const ground = Chessground(elem, liveConfig, 829, top, bot);
 
  let m = new Map();
  m.set("f10", { role: "l-piece", color: "black" });
  ground.setPlinths(m);
  m = new Map();
  m.set("f10", { role: "n-piece", color: "black" });
  m.set("a4", { role: "b-piece", color: "white" });
  ground.setPieces(m);
  ground.state.pockets = readPockets("[KRRRk]", ground.state.pocketRoles!);
  ground.redrawAll();
  console.log(ground.state.pockets);
});

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
