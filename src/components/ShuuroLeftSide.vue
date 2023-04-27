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
import ShuuroStageInfo from "@/components/ShuuroStageInfo.vue";
import ChatRoom from "@/components/ChatRoom.vue";
import ShuuroSpectators from "@/components/ShuuroSpectators.vue";
import { useChat } from "@/store/useChat";
import { useGameStore } from "@/store/game";

const gameStore = useGameStore();
const chatStore = useChat();
</script>
<style></style>
