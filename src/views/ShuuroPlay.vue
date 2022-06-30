<script setup lang="ts">
import { onMounted } from "vue";
import { useShuuroStore2 } from "@/store/useShuuroStore2";
import { useHeaderSettings } from "@/store/headerSettings";

const shuuroStore = useShuuroStore2();
const settings = useHeaderSettings();
shuuroStore.updateClientStage(2);

onMounted(() => {
  if (shuuroStore.$state.game_id == "") {
  } else {
    if (shuuroStore.$state.sfen) {
      shuuroStore.setFightCg();
      shuuroStore.setFightWasm(shuuroStore.$state.sfen);
      shuuroStore.updateClientStage(2);
    }
  }
});
</script>

<style scoped></style>

<template>
  <div id="chessground12" :about="settings.getBoard()"  />
</template>

<style>
.chessground12 {
  padding-bottom: 100%;
}
.chessground12 cg-board {
  background-image: url("@/assets/board/12x12brown.svg");
}
</style>
