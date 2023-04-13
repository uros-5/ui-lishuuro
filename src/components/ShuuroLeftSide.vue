<template>
  <aside class="sidebar-first">
    <ShuuroStageInfo />
    <ChatRoom
      :messages="chatStore.gameChat"
      :ws-type="store.game_id"
      :finished="store.status"
      variant="shuuro"
    />
    <ShuuroSpectators />
  </aside>
</template>
<script setup lang="ts">
import ShuuroStageInfo from "@/components/ShuuroStageInfo.vue";
import ChatRoom from "@/components/ChatRoom.vue";
import ShuuroSpectators from "./ShuuroSpectators.vue";
import { useShuuroStore } from "@/store/useShuuroStore";
import { useChat } from "@/store/useChat";
import { onMounted } from "vue";
const store = useShuuroStore();
const chatStore = useChat();

onMounted(() => {});
</script>
<style></style>
