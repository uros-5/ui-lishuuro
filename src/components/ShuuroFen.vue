<template>
  <div class="movelist-block">
    <div id="movelist">
      <ShuuroFenItem
        v-for="(item, index) in getHistory()"
        v-if="fenItemCheck()"
        :key="index"
        :fen="item[0]"
        :move="fenItem(item)"
        :index="index + 1"
      />

      <div id="result" v-if="shuuroStore.$state.status > 0">
        {{ resultMessage() }}
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useShuuroStore2 } from "@/store/useShuuroStore2";
import ShuuroFenItem from "./ShuuroFenItem.vue";
import { FenItem } from "@/store/useShuuroStore2";
import { resultMessage as Rm } from "@/plugins/resultMessage";
import { useUser } from "@/store/useUser";
const shuuroStore = useShuuroStore2();
const userStore = useUser();

function getHistory(): FenItem[] {
  if (shuuroStore.$state.client_stage == 0) {
    if (shuuroStore.$state.am_i_player) {
      let history = shuuroStore.history(0)!;
      let color = shuuroStore.getColor(userStore.$state.username);
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
  } else if (shuuroStore.$state.client_stage == 1) {
    return shuuroStore.history(1)!;
  } else if (shuuroStore.$state.client_stage == 2) {
    return shuuroStore.history(2)!;
  }
  return [];
}

function fenItem(item: [string, number]): string {
  if (shuuroStore.$state.client_stage == 0) {
    return `${item[0]} ${item[1]}`;
  } else if (shuuroStore.$state.client_stage == 1) {
    let fen = item[0].split("_");
    return fen[0];
  } else if (shuuroStore.$state.client_stage == 2) {
    let fen = item[0].split(" ");
    return fen[4];
  }
  return "";
}

function resultMessage(): string {
  return Rm(
    shuuroStore.$state.result,
    shuuroStore.$state.status,
    shuuroStore.$state.players
  );
}

function fenItemCheck(): boolean {
  return (
    shuuroStore.$state.client_stage == 0 ||
    shuuroStore.$state.client_stage == 1 ||
    shuuroStore.$state.client_stage == 2
  );
}
</script>
<style scoped></style>
