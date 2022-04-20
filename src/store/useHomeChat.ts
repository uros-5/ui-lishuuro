import { defineStore } from "pinia";

export interface ChatMessage {
  user: string;
  message: string;
  time: string;
  t?: string;
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
      this.$state.homeChat.push(message);
      this.$state.homeChat = this.$state.homeChat;
    },
  },
  getters: {},
});
