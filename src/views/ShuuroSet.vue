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
import {
  readPockets,
  renderPocketsInitial,
} from "@/plugins/chessground/pocket";
import { useBoardSize } from "@/store/useBoardSize";
import { useShuuroStore2 } from "@/store/useShuuroStore2";
import { onMounted } from "vue";
import { defaults } from "@/plugins/chessground/state";
import { Api } from "@/plugins/chessground/api";
import { renderWrap } from "@/plugins/chessground/wrap";
import router from "@/router";
import { SEND } from "@/plugins/webSockets";

const store = useBoardSize();
const shuuroStore = useShuuroStore2();

store.updateRowsAndCols(12);
shuuroStore.updateClientStage("deploy");

onMounted(() => {
  if (shuuroStore.$state.game_id == "") {
	/*
    SEND({
      t: "live_game_start",
      game_id: router.currentRoute.value.params["id"],
      color: "white",
    });
    */
  } else {
    shuuroStore.setDeployCg();
  }
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
