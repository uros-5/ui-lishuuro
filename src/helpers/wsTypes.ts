import * as z from "valibot"
import { MessageType } from "./messageType";

export const PlayerCount = z.object({
  t: z.pipe(z.number(), z.value(MessageType.PlayerCount)),
  count: z.number()
});

export const GameCount = z.object({
  t: z.pipe(z.number(), z.value(MessageType.GameCount)),
  count: z.number()
});

export type GameCount = z.InferOutput<typeof GameCount>;

export const RedirectToGame = z.object({
  t: z.pipe(z.number(), z.value(MessageType.RedirectToGame)),
  game: z.string()
});


export const GetHandServer = z.object({
  t: z.pipe(z.number(), z.value(MessageType.GetHand)),
  hand: z.string()
})

export type GetHandServer = z.InferInput<typeof GetHandServer>

export const GameState = z.object({
  _id: z.string(),
  min: z.number(),
  incr: z.number(),
  players: z.tuple([z.string(), z.string()]),
  side_to_move: z.number(),
  last_clock: z.any(),
  current_stage: z.pipe(z.number(), z.minValue(0), z.maxValue(3)),
  result: z.number(),
  status: z.number(),
  variant: z.number(),
  credits: z.tuple([z.number(), z.number()]),
  hands: z.tuple([z.string(), z.string()]),
  sfen: z.string(),
  history: z.tuple([
    z.array(z.string()),
    z.array(z.string()),
    z.array(z.string()),
  ]),
  tc: z.object({
    last_click: z.string(),
    clocks: z.tuple([z.number(), z.number()]),
  }),
  sub_variant: z.number(),
  game_start: z.string(),
  placement_start: z.string(),
  
});

export type GameState = z.InferOutput<typeof GameState>;

export const StartClock = z.object({
  t: z.pipe(z.number(), z.value(MessageType.StartClock)),
  players: z.tuple([z.string(), z.string()]),
  click: z.string(),
})

export type StartClock = z.InferInput<typeof StartClock>

export const ConfirmSelection = z.object(
  {
    t: z.pipe(z.number(), z.value(MessageType.ConfirmSelection)),
    confirmed: z.array(z.boolean())
  })

export const RedirectToPlacement = z.object({
  t: z.pipe(z.number(), z.value(MessageType.RedirectToGame)),
  id: z.string(),
  last_clock: z.string(),
  players: z.pipe(z.array(z.string()), z.maxLength(2)),
  sfen: z.string(),
  variant: z.number(),
  cg: z.optional(z.any())
})

export type RedirectToPlacement = z.InferInput<typeof RedirectToPlacement>

export const NewTvGame = z.object({
  t: z.pipe(z.number(), z.value(MessageType.AddTvGame)),
  game: RedirectToPlacement
})

export type NewTvGame = z.InferInput<typeof NewTvGame>

export const NewTvMove = z.object({
  t: z.pipe(z.number(), z.value(MessageType.NewTvMove)),
  game: z.string(),
  game_move: z.string()
})

export type NewTvMove = z.InferInput<typeof NewTvMove>

export const PlaceMove = z.object(
  {
    t: z.pipe(z.number(), z.value(MessageType.PlacePiece)),
    clocks: z.tuple([z.number(), z.number()]),
    first_move_error: z.boolean(),
    next_stage: z.boolean(),
    sfen: z.string()
  }
)

export const MovePiece = z.object(
  {

    t: z.pipe(z.number(), z.value(MessageType.MovePiece)),
    clocks: z.tuple([z.number(), z.number()]),
    status: z.number(),
    result: z.number(),
    game_move: z.string()
    
  }
)

export type MovePiece = z.InferInput<typeof MovePiece>

export type PlaceMove = z.InferInput<typeof PlaceMove>

export const RemoveTvGame = z.object({
  t: z.pipe(z.number(), z.value(MessageType.RemoveTVGame)),
  game: z.string(),
})

export type RemoveTvGame = z.InferInput<typeof RemoveTvGame>


export const GameEnd = z.object({
  t: z.pipe(z.number(), z.value(MessageType.GameEnd)),
  result: z.number(),
  status: z.number()
})

export const OfferDraw = z.object({
  t: z.pipe(z.number(), z.value(MessageType.Draw)),
  draw_offer: z.boolean(),
  end: z.number()
})

export type GameEnd = z.InferInput<typeof GameEnd>

export const TvGames = z.object({
  t: z.pipe(z.number(), z.value(MessageType.GetTv)),
  games: z.array(RedirectToPlacement)
})

export type TvGames = z.InferInput<typeof TvGames>

export const UserProfileGames = z.object({
  player: z.optional(z.any()),
  games: z.optional(z.array(GameState))
})

export type UserProfileGames = z.InferInput<typeof UserProfileGames>

export type UserLive = {
  isPlayer: boolean,
  player: number,
  loaded: Promise<boolean>,
  resolve: (v: boolean) => void
}
