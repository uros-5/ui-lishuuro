<script setup lang="ts">
import ChatRoom from "@/components/ChatRoom.vue";
import { useChat } from "@/store/useChat";
const store = useChat();
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
