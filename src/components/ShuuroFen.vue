<template>
  <div class="movelist-block">
    <div id="movelist">
      <ShuuroFenItem v-for="(item, index) in getHistory()" v-if="fenItemCheck()" :key="index" :fen="item[0]"
        :move="fenItem(item)" :index="index + 1" />

      <div id="result" v-if="showRes()">
        {{ resultMessage() }}
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useShuuroStore } from "@/store/useShuuroStore";
import ShuuroFenItem from "./ShuuroFenItem.vue";
import type { FenItem } from "@/store/useShuuroStore";
import { resultMessage as Rm } from "@/plugins/resultMessage";
import { useUser } from "@/store/useUser";
const shuuroStore = useShuuroStore();
const userStore = useUser();

function getHistory(): FenItem[] {
  if (shuuroStore.client_stage == 0) {
    if (shuuroStore.am_i_player) {
      let history = shuuroStore.history(0)!;
      let color = shuuroStore.getColor(userStore.username);
      return history.filter((item) => {
        let p = item[0][1];
        if (color == "white") {
          if (p == p.toUpperCase()) {
            return item;
          }
        } else if (color == "black") {
          if (p == p.toLowerCase()) {
            return item;
          }
        }
      });
    }
  } else if (shuuroStore.client_stage == 1) {
    return shuuroStore.history(1)!;
  } else if (shuuroStore.client_stage == 2) {
    return shuuroStore.history(2)!;
  }
  return [];
}

function fenItem(item: [string, number]): string {
  if (shuuroStore.client_stage == 0) {
    return `${item[0]} ${item[1]}`;
  } else if (shuuroStore.client_stage == 1) {
    let fen = item[0].split("_");
    return fen[0];
  } else if (shuuroStore.client_stage == 2) {
    let fen = item[0].split(" ");
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
