import { defineStore } from "pinia";

export interface ChatMessage {
  user: string;
  message: string;
  time: string;
  t?: string;
  id: string;
}

export const useHomeChat = defineStore("useHomeChat", {
  state: () => {
    return {
      homeChat: [{ time: "00:50", user: "user1", message: "This is message" }],
      gameChat: [{ time: "00:50", user: "user1", message: "This is message" }]
    };
  },
  actions: {
    setHomeChat(homeChat: []) {
      this.$state.homeChat = homeChat;
    },
    setGameChat(gameChat: []) {
      this.$state.gameChat = gameChat;
    },
    addGameMessageChat(msg: ChatMessage) {
      delete msg["t"];
      this.$state.gameChat.push(msg);
    },
    sendMessage(message: ChatMessage) {
      this.$state.homeChat.push(message);
      this.$state.homeChat = this.$state.homeChat;
    },
  },
  getters: {},
});
