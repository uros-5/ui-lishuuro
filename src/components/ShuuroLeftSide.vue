<template>
  <aside class="sidebar-first">
    <ShuuroStageInfo />
    <ChatRoom :messages="[]" ws-type="game_live_message" />
    <ShuuroSpectators />
  </aside>
</template>
<script setup lang="ts">
import ShuuroStageInfo from "@/components/ShuuroStageInfo.vue";
import ChatRoom from "@/components/ChatRoom.vue";
import ShuuroSpectators from "./ShuuroSpectators.vue";
</script>
<style></style>
