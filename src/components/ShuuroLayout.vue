<template>
  <main class="round" style="--zoom: 100;">
    <ShuuroLeftSide />
    <ShuuroMain />
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import router from "@/router";
import { useRoute } from "vue-router";
import ShuuroLeftSide from "@/components/ShuuroLeftSide.vue";
import ShuuroMain from "@/components/ShuuroMain.vue";
import { useShuuroStore } from "@/store/useShuuroStore";
import { SEND } from "@/plugins/webSockets";
import { useHomeChat } from "@/store/useHomeChat";

const shuuroStore = useShuuroStore();
const homeChat = useHomeChat();
const zoomValue = ref("100");

onMounted(() => {
  const id = useRoute().params["id"];
  if (id == "" || id == undefined) {
    router.push("/");
  } else {
    if (shuuroStore.game_id == "") {
      let obj = {
        t: "live_game_start",
        game_id: id,
        color: "white",
      };
      SEND(obj);
      SEND({ t: "live_chat_full", game_id: id });
    }
    //fetchData();
  }
});

onUnmounted(() => {
  const id = shuuroStore.game_id;
  const obj = { t: "live_game_remove_spectator", game_id: id };
  SEND(obj);
  shuuroStore.game_id = "";
  homeChat.gameChat = [];
});
</script>

<style>
@import "../assets/styles/round.css";
</style>
