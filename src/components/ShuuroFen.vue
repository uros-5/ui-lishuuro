<template>
  <div class="movelist-block">
    <div id="movelist">
      <ShuuroFenItem v-for="(item, index) in shuuroStore.getHistory()" v-if="fenItemCheck()" :key="index"
        :fen="fenItem(item)" :move="moveItem(item)" :index="index + 1" />

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
const shuuroStore = useShuuroStore();

function fenItem(item: string): string {
  if (shuuroStore.client_stage == 0) {
    return item[0];
  }
  return item;
}

function moveItem(item: string): string {
  if (shuuroStore.client_stage == 0) {
    return item[0];
  } else if (shuuroStore.client_stage == 1) {
    let fen = item.split("_");
    return fen[0];
  } else if (shuuroStore.client_stage == 2) {
    let fen = item.split(" ");
    return fen[4];
  }
  return "";
}

function resultMessage(): string {
  return Rm(
    shuuroStore.result,
    shuuroStore.status,
    shuuroStore.players
  );
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
<style scoped></style>
