<template>
  <main class="round" style="--zoom: 100">
    <ShuuroLeftSide />
    <ShuuroMain />
  </main>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import router from "@/router";
import { useRoute } from "vue-router";
import ShuuroLeftSide from "@/components/ShuuroLeftSide.vue";
import ShuuroMain from "@/components/ShuuroMain.vue";
import { useShuuroStore } from "@/store/useShuuroStore";
import { useWs } from "@/store/useWs";

import { useChat } from "@/store/useChat";

const { SEND } = useWs();
const shuuroStore = useShuuroStore();
const homeChat = useChat();

onMounted(() => {
  const id = useRoute().params["id"];
  const variant = useRoute().params["variant"];
  if (id == "" || id == undefined) {
    router.push("/");
  } else {
    if (shuuroStore.game_id == "") {
      let obj = {
        t: "live_game_start",
        game_id: id,
        color: "white",
        variant: variant,
      };
      SEND(obj);
      SEND({ t: "live_chat_full", data: { game_id: id, variant: "shuuro" } });
    }
    //fetchData();
  }
});

onUnmounted(() => {
  const id = shuuroStore.game_id;
  const obj = {
    t: "live_game_remove_spectator",
    game_id: id,
    variant: "shuuro",
  };
  SEND(obj);
  shuuroStore.game_id = "";
  homeChat.gameChat = [];
});
</script>

<style>
@import "../assets/styles/round.css";
</style>
