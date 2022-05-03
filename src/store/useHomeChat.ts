import { defineStore } from "pinia";

export interface ChatMessage {
  user: string;
  message: string;
  time: string;
  t?: string;
  id: string;
}

export interface HomeChatStore {
  homeChat: ChatMessage[];
  gameChat: ChatMessage[];
}

export const useHomeChat = defineStore("useHomeChat", {
  state: (): HomeChatStore => {
    return {
      homeChat: [],
      gameChat: [],
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
