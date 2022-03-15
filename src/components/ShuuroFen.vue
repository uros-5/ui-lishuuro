<template>
  <div class="movelist-block">
    <div id="movelist">
      <ShuuroFenItem
        v-if="store.$state.clientStage == 'shop' || store.$state.clientStage == 'deploy'"
        v-for="(item, index) in getHistory()"
        :fen="item"
        :index="index + 1"
      />

      <div id="result">{{ resultMessage() }}</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useShuuroStore } from "@/store/useShuuroStore";
import ShuuroFenItem from "./ShuuroFenItem.vue";
const store = useShuuroStore();

onMounted(() => {
  if (store.$state.stage == "shop") {
    console.log(store.$state.shopHistory);
  }
});

function getHistory(): string[] {
  if (store.$state.clientStage == "shop") {
    return store.$state.shopHistory!;
  } else if (store.$state.clientStage == "deploy") {
    return store.$state.deployHistory!;
  }
  return [];
}

function resultMessage(): string {
  let result = store.$state.result;
  switch (store.$state.status) {
    case -1:
      return "Playing right now";
    case 0:
      return "Game aborted";
    case 1:
      return `Checkmate, ${result}`;
    case 2:
      return `${
        result === "1-0" ? store.$state.black : store.$state.white
      }, resigned`;
    case 3:
      return "Stalemate";
    case 4:
      return "Timeout";
    case 5:
      return "Draw";
    default:
      return "";
  }
}
</script>
<style scoped></style>
