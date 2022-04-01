<template>
  <div class="movelist-block">
    <div id="movelist">
      <ShuuroFenItem
        v-if="
          shuuroStore.$state.client_stage == 'shop' ||
          shuuroStore.$state.client_stage == 'deploy'
        "
        v-for="(item, index) in getHistory()"
        :fen="item"
        :index="index + 1"
        @key="index"
      />

      <div id="result">{{ resultMessage() }}</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useShuuroStore } from "@/store/useShuuroStore";
import ShuuroFenItem from "./ShuuroFenItem.vue";
const shuuroStore = useShuuroStore();

onMounted(() => {
  if (shuuroStore.$state.stage == "shop") {
  }
});

function getHistory(): string[] {
  if (shuuroStore.$state.client_stage == "shop") {
    return shuuroStore.$state.shop_history!;
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
        result === "1-0" ? shuuroStore.$state.white : shuuro_store.$state.black
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
