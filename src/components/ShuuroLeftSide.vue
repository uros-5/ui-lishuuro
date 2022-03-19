<template>
  <aside class="sidebar-first">
    <ShuuroStageInfo />
    <ChatRoom :messages="[]" wsType="game_live_message" />
  </aside>
</template>
<script setup lang="ts">
import ShuuroStageInfo from "@/components/ShuuroStageInfo.vue";
import ChatRoom from "@/components/ChatRoom.vue";
</script>
<style></style>
