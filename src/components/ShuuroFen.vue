<template>
  <div
    class="movelist-block"
    :class="{ 'movelist-block2': shuuroStore.analyze }"
  >
    <div id="movelist" :class="{ movelist2: shuuroStore.analyze == true }">
      <ShuuroFenItem
        v-for="(item, index) in shuuroStore.getHistory()"
        v-if="fenItemCheck() && shuuroStore.analysisMoves.length == 0"
        :key="index"
        :fen="fenItem(item)"
        :move="moveItem(item)"
        :index="index + 1"
      />

      <AnalyzeRow v-if="shuuroStore.analysisMoves.length > 0" />

      <div id="result" v-if="showRes()">
        {{ resultMessage() }}
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useShuuroStore } from "@/store/useShuuroStore";
import ShuuroFenItem from "./ShuuroFenItem.vue";
import { resultMessage as Rm } from "@/plugins/resultMessage";
import AnalyzeRow from "./AnalyzeRow.vue";
const shuuroStore = useShuuroStore();

function fenItem(item: string): string {
  if (shuuroStore.client_stage == 0) {
    return `+${item[0]}`;
  }
  return item;
}

function moveItem(item: string): string {
  if (shuuroStore.client_stage == 0) {
    return `+${item}`;
  } else if (shuuroStore.client_stage == 1) {
    let fen = item.split("_");
    return fen[0];
  } else if (shuuroStore.client_stage == 2) {
    let fen = item.split(" ");
    return fen[5];
  }
  return "";
}

function resultMessage(): string {
  return Rm(shuuroStore.result, shuuroStore.status, shuuroStore.players);
}

function fenItemCheck(): boolean {
  return (
    shuuroStore.client_stage == 0 ||
    shuuroStore.client_stage == 1 ||
    shuuroStore.client_stage == 2
  );
}

function showRes(): boolean {
  return (
    shuuroStore.status > 0 &&
    shuuroStore.client_stage == shuuroStore.current_stage
  );
}
</script>
<style scoped>
.movelist-block2 {
  display: flex;
  height: auto;
  max-height: none;
  overflow-y: scroll;
  justify-content: initial;
  grid-row: 3 / span 17;
}

@media (max-width: 799px) and (orientation: portrait) {
  .movelist-block2 {
    grid-row-start: 2;
    grid-row: none;
    grid-area: "moves";
  }
}

.movelist2 {
  height: auto !important;
  overflow-y: initial !important;
}
</style>
