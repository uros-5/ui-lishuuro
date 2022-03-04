import { defineStore } from "pinia";
import { useCookies } from "vue3-cookies";

const cookie = useCookies().cookies;

export interface ChatMessage {
    user: String,
    message: String,
    time: String,
}

export const useHomeChat = defineStore("useHomeChat", {
  state: () => {
    return { homeChat: [ { time: "00:50", user: "user1", message: "This is message" } ] };
  },
  actions: {
    setHomeChat(homeChat: []) {
        this.$state.homeChat = homeChat;
    },
    sendMessage(message: ChatMessage) {
        this.$state.homeChat.push(message);
    }
  },
});
