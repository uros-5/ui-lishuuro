<template>
  <main class="round" style="--zoom: 100">
    <ShuuroLeftSide />
    <ShuuroMain />
  </main>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { useRouter } from "nuxt/app";
import { useRoute } from "vue-router";


import { useWs } from "stores/useWs";

import { useChat } from "stores/useChat";
import { useGameStore } from "stores/game";

const { SEND } = useWs();
const gameStore = useGameStore();

const homeChat = useChat();
const router = useRouter();

onMounted(() => {
  const id = useRoute().params["id"];
  const variant = useRoute().params["variant"];
  gameStore.watchCg();
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
    }
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
