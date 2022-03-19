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
      <div id="messages" v-if="hiddenChat">
        <li v-for="i in messages" class="message">
          <div class="time">{{ i.time }}</div>
          <span class="user">
            <a href="/">{{ i.user }}</a>
          </span>
          <span> {{ i.message }} </span>
        </li>
      </div>
    </ol>

    <input
      v-model="message"
      v-on:keyup.enter="onEnter"
      id="chat-entry"
      maxlength="140"
      type="text"
      name="entry"
      autocomplete="off"
      :placeholder="setPlaceholder()"
      :disabled="toDisableInput()"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, Ref } from "vue";
import { useCookies } from "vue3-cookies";
import { ws } from "@/plugins/webSockets";
import {useUser} from "@/store/useUser";

const props = defineProps<{ messages: ChatMessage[]; wsType: String }>();
const messages: Ref<ChatMessage[]> = ref(props.messages!);
const message = ref("");
const hiddenChat = ref(true);
const cookie = useCookies().cookies;
const user = useUser();

function onEnter(): void {
  if (message.value.length > 0 && message.value.length < 80) {
    ws.send(
      JSON.stringify({
        t: props.wsType!, //"home_chat_message",
        message: message.value,
        user: user.$state.username, 
        time: "",
      })
    );
    message.value = "";
  }
}

function setPlaceholder(): string {
  if (cookie.get("reg") == undefined) {
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
  time: String;
  user: String;
  message: String;
}
</script>

<style scoped>
.user {
  padding-right: 6px;
  font-weight: bold;
}
</style>
