import { defineStore } from "pinia";
import { z } from "zod";

export const ChatMessage = z.object({
  user: z.string(),
  message: z.string(),
  time: z.string(),
  id: z.string(),
  variant: z.string(),
});

export type ChatMessage = z.infer<typeof ChatMessage>;

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
    setHomeChat(homeChat: ChatMessage[]) {
      this.homeChat = homeChat;
    },
    setGameChat(gameChat: ChatMessage[]) {
      this.gameChat = gameChat;
    },
    addGameMessageChat(msg: ChatMessage) {
      this.gameChat.push(msg);
    },
    sendMessage(message: ChatMessage) {
      this.homeChat.push(message);
    },
  },
  getters: {},
});
