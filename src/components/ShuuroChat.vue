<template>
  <div id="roundchat" class="roundchat chat">
    <div class="chatroom">
      Chat room
      <input
        id="checkbox"
        title="Toggle the chat"
        name="checkbox"
        type="checkbox"
        @click="hiddenChat = !hiddenChat"
      />
    </div>
    <ol id="lobbychat-messages">
      <div id="messages" v-if="hiddenChat">
        <li v-for="i in messages" :key="i" class="message">
          <div class="time">{{ i.time }}</div>
          <span class="user">
            <a href="/">{{ i.user }}</a>
          </span>
          <span> {{ i.message }} </span>
        </li>
      </div>
    </ol>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';

let messages = [];
let hiddenChat = ref(false); 

for (let i = 0; i < 50; i++) {
  messages.push({
    time: "00:50",
    user: `user${i}`,
    message: "This is message",
  });
}
// let messages = [ { time: "00:50", user: "user1", message: "This is message" }];
</script>
<style scoped>
.user {
  padding-right: 6px;
  font-weight: bold;
}
</style>
