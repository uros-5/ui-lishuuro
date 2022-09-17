<template>
  <main class="round" style="--zoom: 100">
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
import { ShuuroStore, useShuuroStore2 } from "@/store/useShuuroStore2";
import { useUser } from "@/store/useUser";
import { Clock } from "@/plugins/clock";
import { SEND, ws } from "@/plugins/webSockets";
import { useHomeChat } from "@/store/useHomeChat";

const shuuroStore = useShuuroStore2();
const userStore = useUser();
const homeChat = useHomeChat();

onMounted(() => {
  const id = useRoute().params["id"];
  if (id == "" || id == undefined) {
    router.push("/");
  } else {
    if (shuuroStore.$state.game_id == "") {
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
  const id = shuuroStore.$state.game_id;
  const obj = { t: "live_game_remove_spectator", game_id: id };
  SEND(obj);
  shuuroStore.$state.game_id = "";
  homeChat.$state.gameChat = [];
});
const zoomValue = ref("100");
</script>

<style>
@import "../assets/styles/round.css";
</style>
