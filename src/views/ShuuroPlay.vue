<script setup lang="ts">
import { onMounted } from "vue";
import { useShuuroStore2 } from "@/store/useShuuroStore2";

const shuuroStore = useShuuroStore2();
shuuroStore.updateClientStage("fight");

onMounted(() => {
  if (shuuroStore.$state.game_id == "") {
  } else {
    if (shuuroStore.$state.sfen) {
      shuuroStore.setFightCg();
      shuuroStore.setFightWasm(shuuroStore.$state.sfen);
      shuuroStore.updateClientStage("fight");
    }
  }
});
</script>

<style scoped></style>

<template>
  <div class="chessground12" />
</template>


<style>
.chessground12 {
  padding-bottom: 100%;
}
.chessground12 cg-board {
  background-image: url("@/assets/board/12x12brown.svg");
}
</style>
