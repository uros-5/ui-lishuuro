<script setup lang="ts">
import { onMounted } from "vue";
import { useShuuroStore } from "@/store/useShuuroStore";
import { useHeaderSettings } from "@/store/headerSettings";

const shuuroStore = useShuuroStore();
const settings = useHeaderSettings();
shuuroStore.updateClientStage(2);

onMounted(() => {
  if (shuuroStore.game_id == "") {
  } else {
    if (shuuroStore.sfen) {
      shuuroStore.setFightCg();
      shuuroStore.setFightWasm(shuuroStore.sfen);
      shuuroStore.updateClientStage(2);
    }
  }
});
</script>

<style scoped></style>

<template>
  <div id="chessground12" class="chessground12" :class="{ 'standard8': shuuroStore.variant == 'standard' }"
    :data-board="settings.getBoard()" :data-piece="settings.getPiece()" />
</template>

<style>
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
