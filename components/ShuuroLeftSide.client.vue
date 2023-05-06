<template>
  <aside class="sidebar-first">
    <ShuuroStageInfo />
    <ChatRoom
      :messages="chatStore.gameChat"
      :ws-type="gameStore.state._id"
      :finished="gameStore.state.status"
      variant="shuuro"
    />
    <ShuuroSpectators />
  </aside>
</template>
<script setup lang="ts">



import { useChat } from "stores/useChat";
import { useGameStore } from "stores/game";

const gameStore = useGameStore();
const chatStore = useChat();
</script>
<style></style>
