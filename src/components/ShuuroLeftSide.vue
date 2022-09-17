<template>
  <aside class="sidebar-first">
    <ShuuroStageInfo />
    <ChatRoom
      :messages="chatStore.$state.gameChat"
      :ws-type="store.$state.game_id"
    />
    <ShuuroSpectators />
  </aside>
</template>
<script setup lang="ts">
import ShuuroStageInfo from "@/components/ShuuroStageInfo.vue";
import ChatRoom from "@/components/ChatRoom.vue";
import ShuuroSpectators from "./ShuuroSpectators.vue";
import { useShuuroStore2 } from "@/store/useShuuroStore2";
import { useHomeChat } from "@/store/useHomeChat";
const store = useShuuroStore2();
const chatStore = useHomeChat();
</script>
<style></style>
