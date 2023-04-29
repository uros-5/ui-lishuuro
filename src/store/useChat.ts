import { defineStore } from "pinia";
import { ref } from "vue";
import { z } from "zod";

export const ChatMessage = z.object({
  user: z.string(),
  message: z.string(),
  time: z.string(),
  id: z.string(),
  variant: z.string(),
});

export type ChatMessage = z.infer<typeof ChatMessage>;

export const useChat = defineStore("useChat", () => {
  const homeChat = ref([] as ChatMessage[]);
  const gameChat = ref([] as ChatMessage[]);
  return { homeChat, gameChat };
});
