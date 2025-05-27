import * as v from 'valibot'
import { MessageType } from './messageType'

export const PlayerCount = v.object({
  t: v.pipe(v.number(), v.value(MessageType.PlayerCount)),
  count: v.number(),
})

export const GameCount = v.object({
  t: v.pipe(v.number(), v.value(MessageType.GameCount)),
  count: v.number(),
})

export type GameCount = v.InferOutput<typeof GameCount>

export const RedirectToGame = v.object({
  t: v.pipe(v.number(), v.value(MessageType.RedirectToGame)),
  game: v.string(),
})

export const GetHandServer = v.object({
  t: v.pipe(v.number(), v.value(MessageType.GetHand)),
  hand: v.string(),
})

export type GetHandServer = v.InferInput<typeof GetHandServer>

export const GameState = v.object({
  _id: v.string(),
  min: v.number(),
  incr: v.number(),
  players: v.tuple([v.string(), v.string()]),
  side_to_move: v.number(),
  last_clock: v.any(),
  current_stage: v.pipe(v.number(), v.minValue(0), v.maxValue(3)),
  result: v.number(),
  status: v.number(),
  variant: v.number(),
  credits: v.tuple([v.number(), v.number()]),
  hands: v.tuple([v.string(), v.string()]),
  sfen: v.string(),
  history: v.tuple([v.array(v.string()), v.array(v.string()), v.array(v.string())]),
  tc: v.object({
    last_click: v.string(),
    clocks: v.tuple([v.number(), v.number()]),
  }),
  sub_variant: v.number(),
  game_start: v.string(),
  placement_start: v.string(),
})

export type GameState = v.InferOutput<typeof GameState>

export const StartClock = v.object({
  t: v.pipe(v.number(), v.value(MessageType.StartClock)),
  players: v.tuple([v.string(), v.string()]),
  click: v.string(),
})

export type StartClock = v.InferInput<typeof StartClock>

export const ConfirmSelection = v.object({
  t: v.pipe(v.number(), v.value(MessageType.ConfirmSelection)),
  confirmed: v.array(v.boolean()),
})

export const RedirectToPlacement = v.object({
  t: v.pipe(v.number(), v.value(MessageType.RedirectToGame)),
  id: v.string(),
  last_clock: v.string(),
  players: v.pipe(v.array(v.string()), v.maxLength(2)),
  sfen: v.string(),
  variant: v.number(),
  cg: v.optional(v.any()),
})

export type RedirectToPlacement = v.InferInput<typeof RedirectToPlacement>

export const NewTvGame = v.object({
  t: v.pipe(v.number(), v.value(MessageType.AddTvGame)),
  game: RedirectToPlacement,
})

export type NewTvGame = v.InferInput<typeof NewTvGame>

export const NewTvMove = v.object({
  t: v.pipe(v.number(), v.value(MessageType.NewTvMove)),
  game: v.string(),
  game_move: v.string(),
})

export type NewTvMove = v.InferInput<typeof NewTvMove>

export const PlaceMove = v.object({
  t: v.pipe(v.number(), v.value(MessageType.PlacePiece)),
  clocks: v.tuple([v.number(), v.number()]),
  first_move_error: v.boolean(),
  next_stage: v.boolean(),
  sfen: v.string(),
})

export const MovePiece = v.object({
  t: v.pipe(v.number(), v.value(MessageType.MovePiece)),
  clocks: v.tuple([v.number(), v.number()]),
  status: v.number(),
  result: v.number(),
  game_move: v.string(),
})

export type MovePiece = v.InferInput<typeof MovePiece>

export type PlaceMove = v.InferInput<typeof PlaceMove>

export const RemoveTvGame = v.object({
  t: v.pipe(v.number(), v.value(MessageType.RemoveTVGame)),
  game: v.string(),
})

export type RemoveTvGame = v.InferInput<typeof RemoveTvGame>

export const GameEnd = v.object({
  t: v.pipe(v.number(), v.value(MessageType.GameEnd)),
  result: v.number(),
  status: v.number(),
})

export const OfferDraw = v.object({
  t: v.pipe(v.number(), v.value(MessageType.Draw)),
  draw_offer: v.boolean(),
  end: v.number(),
})

export type GameEnd = v.InferInput<typeof GameEnd>

export const TvGames = v.object({
  t: v.pipe(v.number(), v.value(MessageType.GetTv)),
  games: v.array(RedirectToPlacement),
})

export type TvGames = v.InferInput<typeof TvGames>

export const UserProfileGames = v.object({
  player: v.optional(v.any()),
  games: v.optional(v.array(GameState)),
})

export type UserProfileGames = v.InferInput<typeof UserProfileGames>

export type UserLive = {
  isPlayer: boolean
  player: number
  loaded: Promise<boolean>
  resolve: (v: boolean) => void
}
