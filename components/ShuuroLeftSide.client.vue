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
const gameStore = useGameStore();
const chatStore = useChat();
</script>
<style></style>
