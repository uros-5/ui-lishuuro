<template>
  <div
    id="chessground12"
    class="chessground12"
    :class="{ standard8: shuuroStore.variant.startsWith('standard') }"
    :data-board="settings.getBoard()"
    :data-piece="settings.getPiece()"
    :data-size="settings.getVariant(shuuroStore.getVariant())"
  />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { useShuuroStore } from "@/store/useShuuroStore";
import { useHeaderSettings } from "@/store/headerSettings";
import init from "shuuro-wasm";

const shuuroStore = useShuuroStore();
const settings = useHeaderSettings();
shuuroStore.updateClientStage(2);

async function setTempFen() {
  if (shuuroStore.client_stage != shuuroStore.current_stage) {
    init().then((_) => {
      shuuroStore.fastForward();
    });
  }
}

onMounted(async () => {
  if (shuuroStore.game_id == "") {
  } else {
    shuuroStore.analyze = true;
    if (!shuuroStore.canAnalyze()) {
      shuuroStore.redirect("/");
    }
    if (shuuroStore.sfen) {
      shuuroStore.setFightCg();
      shuuroStore.setFightWasm(shuuroStore.sfen);
      shuuroStore.updateClientStage(2);
      await setTempFen();
      shuuroStore.redirect(`/shuuro/3/${shuuroStore.game_id}`);
    }
  }
  setTimeout(() => {
    shuuroStore.analyze = true;
    shuuroStore.switchToLiveConfig();
    setTimeout(() => {
      shuuroStore.legal_moves();
    }, 300);
  }, 150);
});

onUnmounted(() => {
  shuuroStore.analyze = false;
  shuuroStore.analysisMoves = [];
});
</script>

<style scoped>
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
