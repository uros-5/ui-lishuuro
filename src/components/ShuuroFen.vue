<template>
  <div class="movelist-block">
    <div id="movelist">
      <ShuuroFenItem
        v-for="(item, index) in getHistory()"
        v-if="
          shuuroStore.$state.client_stage == 'shop' ||
            shuuroStore.$state.client_stage == 'deploy'
        "
        :fen="item[0]"
        :index="index + 1"
        @key="index"
      />

      <div id="result">
        {{ resultMessage() }}
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useShuuroStore } from "@/store/useShuuroStore";
import ShuuroFenItem from "./ShuuroFenItem.vue";
import { FenItem } from "@/store/useShuuroStore";
import { useUser } from "@/store/useUser";
const shuuroStore = useShuuroStore();
const userStore = useUser();

onMounted(() => {
  if (shuuroStore.$state.current_stage == "shop") {
  }
});

function getHistory(): FenItem[] {
  if (shuuroStore.$state.client_stage == "shop") {
    if (shuuroStore.$state.am_i_player) {
      let history = shuuroStore.$state.shop_history!;
      let color = shuuroStore.getColor(userStore.$state.username);
      return history.filter((item) => {
        let p = item[0][1];
        if (color == "white") {
          if (p == p.toUpperCase()) {
            console.log(p);
            return item;
          }
        } else if (color == "black") {
          if (p == p.toLowerCase()) {
            return item;
          }
        }
      });
    }
  } else if (shuuroStore.$state.client_stage == "deploy") {
    return shuuroStore.$state.deploy_history!;
  }
  return [];
}

function resultMessage(): string {
  let result = shuuroStore.$state.result;
  switch (shuuroStore.$state.status) {
    case -1:
      return "Playing right now";
    case 0:
      return "Game aborted";
    case 1:
      return `Checkmate, ${result}`;
    case 2:
      return `${
        result === "1-0" ? shuuroStore.$state.white : shuuroStore.$state.black
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
