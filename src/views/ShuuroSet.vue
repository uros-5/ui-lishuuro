<template>
  <div
    id="chessground12"
    class="chessground12"
    :data-board="settings.getBoard()"
    :data-piece="settings.getPiece()"
  />
  <!--
  <div class="cg-wrap cg-512 orientation-white shuuro-board manipulable">
    <cg-container :style="setStyle()">
      <cg-board> </cg-board>
    </cg-container>
  </div>
--></template>
<script setup lang="ts">
import Chessground from "chessground12";
import { anonConfig, liveConfig } from "chessground12/configs";
import { readPockets, renderPocketsInitial } from "chessground12/pocket";
import { useBoardSize } from "@/store/useBoardSize";
import { useShuuroStore2 } from "@/store/useShuuroStore2";
import { onMounted } from "vue";
import { defaults } from "chessground12/state";
import { Api } from "chessground12/api";
import { renderWrap } from "chessground12/wrap";
import router from "@/router";
import { SEND } from "@/plugins/webSockets";
import { useHeaderSettings } from "@/store/headerSettings";

const store = useBoardSize();
const shuuroStore = useShuuroStore2();
const settings = useHeaderSettings();

store.updateRowsAndCols(12);
shuuroStore.updateClientStage(1);

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
    if (shuuroStore.$state.sfen) {
      shuuroStore.setDeployCg();
      shuuroStore.setDeployWasm(shuuroStore.$state.sfen);
      shuuroStore.updateClientStage(1);
    }
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
