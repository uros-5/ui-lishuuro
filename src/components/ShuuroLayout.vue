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
import { useWs } from "@/store/useWs";

import { useChat } from "@/store/useChat";
import { useGameStore } from "@/store/game";

const { SEND } = useWs();
const gameStore = useGameStore();

const homeChat = useChat();

onMounted(() => {
  const id = useRoute().params["id"];
  const variant = useRoute().params["variant"];
  if (id == "" || id == undefined) {
    router.push("/");
  } else {
    if (gameStore.state._id == "") {
      let obj = {
        t: "live_game_start",
        game_id: id,
        color: "white",
        variant: variant,
      };
      SEND(obj);
      SEND({ t: "live_chat_full", data: { game_id: id, variant: "shuuro" } });
      gameStore.watchCg();
    }
    //fetchData();
  }
});

onUnmounted(() => {
  const id = gameStore.state._id;
  const obj = {
    t: "live_game_remove_spectator",
    game_id: id,
    variant: "shuuro",
  };
  SEND(obj);
  gameStore.reset();
  homeChat.gameChat = [];
});
</script>

<style>
@import "../assets/styles/round.css";
</style>
