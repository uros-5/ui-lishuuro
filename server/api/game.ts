import { z } from "zod"

export default defineEventHandler(async (event) => {
  const { id } = getQuery(event);
  const req = await GET(`/nuxt/shuuro/${id}`);
  const game = Game.parse(req.data);
  if (game.exist) {
    let message = game.status! < 0 ? "Live" : resultMessage(game.result!, game.status!, game.players!);
    let head = `${game.players![0]} vs ${game.players![1]} | ${message}`
    return head;
  }
  return "Game doesn't exist";
})

const Game = z.object({
  exist: z.boolean(),
  players: z.tuple([z.string(), z.string()]).optional(),
  result: z.string().optional(),
  status: z.number().optional()
})

type Game = z.infer<typeof Game>;
