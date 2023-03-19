import { ChatMessage } from "@/store/useHomeChat";
import { z } from "zod";

export const LiveChatFull = z.object({
  id: z.string(),
  lines: z.array(ChatMessage),
});

export type LiveChatFull = z.infer<typeof LiveChatFull>;

export const Cnt = z.object({
  cnt: z.number(),
});

export type Cnt = z.infer<typeof Cnt>;

export interface activePlayersCnt {
  cnt: number;
}

export const SpecCnt = z.object({
  game_id: z.string(),
  count: z.number(),
});

export type SpecCnt = z.infer<typeof SpecCnt>;

export const LiveGameHand = z.object({
  hand: z.string(),
});

export type LiveGameHand = z.infer<typeof LiveGameHand>;

export const LobbyGame = z.object({
  username: z.string(),
  variant: z.string(),
  sub_variant: z.number(),
  time: z.number(),
  incr: z.number(),
  color: z.string(),
});

export type LobbyGame = z.infer<typeof LobbyGame>;

export const HomeLobbyFull = z.object({
  lobbyGames: z.array(LobbyGame),
});

export type HomeLobbyFull = z.infer<typeof HomeLobbyFull>;

export const ActivePlayersFull = z.object({
  players: z.array(z.string()),
});

export type ActivePlayersFull = z.infer<typeof ActivePlayersFull>;

export const TvGame = z.object({
  game_id: z.string(),
  w: z.string(),
  b: z.string(),
  sfen: z.string(),
  variant: z.string(),
  stage: z.number().optional(),
  pl_set: z.boolean().optional(),
  pieces_set: z.boolean().optional(),
  cs: z.number().optional(),
  cg: z.any(),
});

export type TvGame = z.infer<typeof TvGame>;

export const LiveGamePlace = z.object({
  game_move: z.string(),
  game_id: z.string(),
  to_fight: z.boolean(),
  first_move_error: z.boolean(),
  clocks: z.tuple([z.number(), z.number()]),
});

export type LiveGamePlace = z.infer<typeof LiveGamePlace>;

export const LiveGameFight = z.object({
  game_move: z.string(),
  game_id: z.string(),
  status: z.number(),
  clocks: z.tuple([z.number(), z.number()]),
  outcome: z.string(),
});

export type LiveGameFight = z.infer<typeof LiveGameFight>;

export const RedirectDeploy = z.object({
  path: z.string(),
  hand: z.string(),
  last_clock: z.string(),
  side_to_move: z.string(),
  w: z.string(),
  b: z.string(),
  sfen: z.string(),
  variant: z.string(),
});

export type RedirectDeploy = z.infer<typeof RedirectDeploy>;

export const LiveGameLost = z.object({
  game_id: z.string(),
  status: z.number(),
  result: z.string(),
});

export type LiveGameLost = z.infer<typeof LiveGameLost>;

export const LiveGameEnd = z.object({
  game_id: z.string(),
});

export type LiveGameEnd = z.infer<typeof LiveGameEnd>;

export const LiveGameDraw = z.object({
  game_id: z.string().optional(),
  draw: z.boolean(),
  player: z.string().optional(),
});

export type LiveGameDraw = z.infer<typeof LiveGameDraw>;

export const LiveGameResign = z.object({
  game_id: z.string(),
  resign: z.boolean(),
  player: z.string(),
});

export type LiveGameResign = z.infer<typeof LiveGameResign>;

export const TvGames = z.object({
  games: z.array(TvGame),
});

export type TvGames = z.infer<typeof TvGames>;

export const TvGameUpdate = z.object({
  t: z.string(),
  data: LiveGamePlace.or(LiveGameFight)
    .or(RedirectDeploy)
    .or(LiveGameDraw)
    .or(LiveGameResign)
    .or(LiveGameEnd),
});

export type TvGameUpdate = z.infer<typeof TvGameUpdate>;

export const LiveGameConfirmed = z.object({
  confirmed: z.tuple([z.boolean(), z.boolean()]),
});

export const ENDED_TYPES = [LiveGameResign, LiveGameDraw, LiveGameEnd];

export interface homeLobbyRemoveByUser {
  username: string;
}

export interface liveGameStart {
  game_id: string;
  game_info: {};
}

export const GameInfo = z.object({
  _id: z.string(),
  min: z.number(),
  incr: z.number(),
  players: z.tuple([z.string(), z.string()]),
  side_to_move: z.number(),
  last_clock: z.any(),
  current_stage: z.number(),
  result: z.string(),
  status: z.number(),
  variant: z.string(),
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
});

export type GameInfo = z.infer<typeof GameInfo>;

export const LiveGameStart = z.object({
  game_id: z.string(),
  game_info: GameInfo,
});

export type LiveGameStart = z.infer<typeof LiveGameStart>;

export const LiveGameSfen = z.object({
  game_id: z.string(),
  fen: z.string(),
  current_stage: z.number(),
  variant: z.string(),
});

export type LiveGameSfen = z.infer<typeof LiveGameSfen>;

export const PauseConfirmed = z.object({
  confirmed: z.tuple([z.boolean(), z.boolean()]),
});

export type PauseConfirmed = z.infer<typeof PauseConfirmed>;
