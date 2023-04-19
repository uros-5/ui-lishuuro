<template>
  <aside class="sidebar-first">
    <ShuuroStageInfo />
    <ChatRoom
      :messages="chatStore.gameChat"
      :ws-type="store.state._id"
      :finished="store.state.status"
      variant="shuuro"
    />
    <ShuuroSpectators />
  </aside>
</template>
<script setup lang="ts">
import ShuuroStageInfo from "@/components/ShuuroStageInfo.vue";
import ChatRoom from "@/components/ChatRoom.vue";
import ShuuroSpectators from "./ShuuroSpectators.vue";
import { useChat } from "@/store/useChat";
import { useGameStore } from "@/store/game";

const store = useGameStore();
const chatStore = useChat();
</script>
<style></style>
