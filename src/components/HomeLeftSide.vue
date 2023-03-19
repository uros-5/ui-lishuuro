<script setup lang="ts">
import ChatRoom from "@/components/ChatRoom.vue";
import { useHomeChat } from "@/store/useHomeChat";
const store = useHomeChat();
</script>

<template>
  <aside class="sidebar-first">
    <!-- <HomeArenaNotification /> -->
    <ChatRoom
      :messages="store.homeChat"
      variant="home"
      ws-type="home"
      :finished="-1"
    />
  </aside>
</template>

<style></style>
