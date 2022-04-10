<script setup lang="ts">
import HomeArenaNotification from "@/components/HomeArenaNotification.vue";
import ChatRoom from "@/components/ChatRoom.vue";
import { useHomeChat } from "@/store/useHomeChat";
const store = useHomeChat();
</script>

<template>
  <aside class="sidebar-first">
    <HomeArenaNotification />
    <ChatRoom :messages="store.$state.homeChat" ws-type="home_chat_message" />
  </aside>
</template>

<style></style>
