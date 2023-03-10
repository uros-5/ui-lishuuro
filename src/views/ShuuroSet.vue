<template>
  <div id="chessground12" class="chessground12" :class="{ 'standard8': shuuroStore.variant.startsWith('standard') }"
    :data-board="settings.getBoard()" :data-piece="settings.getPiece()"
    :data-size="settings.getVariant(shuuroStore.getVariant())" />
</template>
<script setup lang="ts">
import { useBoardSize } from "@/store/useBoardSize";
import { useShuuroStore } from "@/store/useShuuroStore";
import { onMounted } from "vue";
import { useHeaderSettings } from "@/store/headerSettings";

const store = useBoardSize();
const shuuroStore = useShuuroStore();
const settings = useHeaderSettings();

store.updateRowsAndCols(12);
shuuroStore.updateClientStage(1);

onMounted(() => {
  if (shuuroStore.game_id == "") {
    /*
    SEND({
      t: "live_game_start",
      game_id: router.currentRoute.value.params["id"],
      color: "white",
    });
    */
  } else {
    if (shuuroStore.sfen) {
      shuuroStore.setDeployCg();
      shuuroStore.setDeployWasm(shuuroStore.sfen);
      shuuroStore.updateClientStage(1);
    }
  }
});
</script>

<style>
.chessground12 {
  padding-bottom: 100%;
}

.chessground12 cg-board {
  background-image: url("@/assets/board/12x12brown.svg");
}

.chessground12.standard8 cg-board {
  background-image: url("@/assets/board/8x8brown.svg");
}

/*
.shuuro-board cg-board {
  background-image: url("@/assets/board/12x12brown.svg");
}
*/
</style>
