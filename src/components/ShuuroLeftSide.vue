<template>
  <aside class="sidebar-first">
    <ShuuroStageInfo />
    <ChatRoom
      :messages="chatStore.gameChat"
      :ws-type="store.game_id"
      :finished="store.status"
    />
    <ShuuroSpectators />
  </aside>
</template>
<script setup lang="ts">
import ShuuroStageInfo from "@/components/ShuuroStageInfo.vue";
import ChatRoom from "@/components/ChatRoom.vue";
import ShuuroSpectators from "./ShuuroSpectators.vue";
import { useShuuroStore } from "@/store/useShuuroStore";
import { useHomeChat } from "@/store/useHomeChat";
const store = useShuuroStore();
const chatStore = useHomeChat();
</script>
<style></style>
