<template>
  <div id="roundchat" class="roundchat chat">
    <div class="chatroom">
      Chat room
      <input
        id="checkbox"
        title="Toggle the chat"
        name="checkbox"
        type="checkbox"
        @click="toggle"
      />
    </div>
    <ol id="lobbychat-messages">
      <div v-if="hiddenChat" id="messages">
        <li v-for="i in messages" :key="i.time" class="message">
          <div class="time">{{ i.time }}</div>
          <span class="user">
            <a href="/">{{ i.user }}</a>
          </span>
          <span>{{ i.message }}</span>
        </li>
      </div>
    </ol>

    <input
      id="chat-entry"
      v-model="message"
      maxlength="50"
      type="text"
      name="entry"
      autocomplete="off"
      :placeholder="setPlaceholder()"
      :disabled="toDisableInput()"
      @keyup.enter="onEnter"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps } from "vue";
import { useCookies } from "vue3-cookies";
import { useUser } from "@/store/useUser";
import { SEND } from "@/plugins/webSockets";

const props = defineProps<{ messages: ChatMessage[]; wsType: string }>();
const message = ref("");
const hiddenChat = ref(true);
const cookie = useCookies().cookies;
const user = useUser();

function onEnter(): void {
  if (message.value.length > 0 && message.value.length < 80) {
    SEND({
      t: "live_chat_message", 
      message: message.value,
      user: user.$state.username,
      time: "",
      id: props.wsType 
    });
    message.value = "";
  }
}

function setPlaceholder(): string {
  if (user.$state.reg == false) {
    return "Sign in to chat";
  } else {
    return "Please be nice in the chat!";
  }
}

function toDisableInput() {
  if (cookie.get("reg") == undefined || cookie.get("reg") == "false") {
    return true;
  }
  return false;
}


let toggle = (): void => {
  hiddenChat.value = !hiddenChat.value;
};

interface ChatMessage {
  time: string;
  user: string;
  message: string;
}
</script>

<style scoped>
.user {
  padding-right: 6px;
  font-weight: bold;
}
</style>
