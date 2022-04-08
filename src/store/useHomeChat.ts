import { defineStore } from "pinia";
import { useCookies } from "vue3-cookies";

const cookie = useCookies().cookies;

export interface ChatMessage {
  user: string;
  message: string;
  time: string;
}

export const useHomeChat = defineStore("useHomeChat", {
  state: () => {
    return {
      homeChat: [{ time: "00:50", user: "user1", message: "This is message" }],
    };
  },
  actions: {
    setHomeChat(homeChat: []) {
      this.$state.homeChat = homeChat;
    },
    sendMessage(message: ChatMessage) {
      delete message["t"];
      console.log(message);
      this.$state.homeChat.push(message);
      this.$state.homeChat = this.$state.homeChat;
    },
  },
});
