import { z } from "zod"
import { GET2 } from "~/utils/axios";

export default defineEventHandler(async (event) => {
  const { id } = getQuery(event);
  const req = await GET2(`nuxt/shuuro/${id}`);
  const game = Game.parse(req == null ? undefined : req);
  if (game.exist) {
    let message = game.status! < 0 ? "Live" : "Replay";
    let head = `${game.players![0]} vs ${game.players![1]} | ${message} - ${id}`
    return head;
  }
  return "Game doesn't exist";
})

const Game = z.object({
  exist: z.boolean(),
  players: z.tuple([z.string(), z.string()]).optional(),
  result: z.string().optional(),
  status: z.number().optional()
}).default({ exist: false })

type Game = z.infer<typeof Game>;
