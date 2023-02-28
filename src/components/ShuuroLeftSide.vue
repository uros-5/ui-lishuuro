<template>
  <aside class="sidebar-first">
    <ShuuroStageInfo />
    <ChatRoom
      :messages="chatStore.gameChat"
      :ws-type="store.game_id"
      :finished="store.status"
      variant=""
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
import { onMounted } from "vue";
const store = useShuuroStore();
const chatStore = useHomeChat();

onMounted(() => {
  
})
</script>
<style></style>
