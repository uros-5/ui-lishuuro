import { ChatMessage } from "@/store/useHomeChat";
import { z } from "zod";

export const LiveChatFull = z.object({
  id: z.string(),
  lines: z.array(ChatMessage)
});

export type LiveChatFull = z.infer<typeof LiveChatFull>;

export const Cnt = z.object({
  t: z.string(),
  cnt: z.number()
});

export type Cnt = z.infer<typeof Cnt>;

export interface activePlayersCnt {
  t: string;
  cnt: number;
}

export const SpecCnt = z.object({
  t: z.string(),
  game_id: z.string(),
  count: z.number()
});

export type SpecCnt = z.infer<typeof SpecCnt>;

export const LiveGameHand = z.object({
  t: z.string(),
  hand: z.string()
})

export type LiveGameHand = z.infer<typeof LiveGameHand>;

export const LobbyGame = z.object({
  username: z.string(),
  variant: z.string(),
  time: z.number(),
  incr: z.number(),
  color: z.string(),
  t: z.string().optional()
})

export type LobbyGame = z.infer<typeof LobbyGame>;

export const HomeLobbyFull = z.object({
  lobbyGames: z.array(LobbyGame)
})

export type HomeLobbyFull = z.infer<typeof HomeLobbyFull>;

export const ActivePlayersFull = z.object({
  t: z.string(),
  players: z.array(z.string())
})

export type ActivePlayersFull = z.infer<typeof ActivePlayersFull>;

export const tvGame = z.object({
  t: z.string(),
  game_id: z.string(),
  w: z.string(),
  b: z.string(),
  sfen: z.string(),
});

export type tvGame = z.infer<typeof tvGame>;

export const TvGames = z.object({
  t: z.string(),
  games: z.array(tvGame)
});

export type TvGames = z.infer<typeof TvGames>;

export const TvGameUpdate = z.object({
  t: z.string(),
  g: z.any()
});;

export type TvGameUpdate = z.infer<typeof TvGameUpdate>;

export const LiveGamePlace = z.object({
  t: z.string(),
  game_move: z.string(),
  game_id: z.string(),
  to_fight: z.boolean(),
  first_move_error: z.boolean(),
  clocks: z.tuple([z.number(), z.number()])
});;

export type LiveGamePlace = z.infer<typeof LiveGamePlace>;

export const LiveGameFight = z.object({
  t: z.string(),
  game_move: z.string(),
  game_id: z.string(),
  status: z.number(),
  clocks: z.tuple([z.number(), z.number()]),
  outcome: z.string()
});

export type LiveGameFight = z.infer<typeof LiveGameFight>;

export const LiveGameConfirmed = z.object({
  t: z.string(),
  confirmed: z.tuple([z.boolean(), z.boolean()])
});

export const LiveGameEnd = z.object({
  t: z.string(),
  game_id: z.string()
});

export type liveGameEnd = z.infer<typeof LiveGameEnd>;


export const LiveGameDraw = z.object({
  t: z.string(),
  game_id: z.string().optional(),
  draw: z.boolean(),
  player: z.string().optional()
})

export type LiveGameDraw = z.infer<typeof LiveGameDraw>;


export const LiveGameResign = z.object({
  t: z.string(),
  game_id: z.string(),
  resign: z.boolean(),
  player: z.string()
})

export type LiveGameResign = z.infer<typeof LiveGameResign>;

export const ENDED_TYPES = [LiveGameResign, LiveGameDraw, LiveGameEnd];

export const RedirectDeploy = z.object({
  t: z.string(),
  path: z.string(),
  hand: z.string(),
  last_clock: z.string(),
  side_to_move: z.string(),
  w: z.string(),
  b: z.string(),
  sfen: z.string()
});

export type RedirectDeploy = z.infer<typeof RedirectDeploy>;

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
  history: z.tuple([z.array(z.string()), z.array(z.string()), z.array(z.string())]),
  tc: z.object({
    last_click: z.string(),
    clocks: z.tuple([z.number(), z.number()]),
  })
})

export type GameInfo = z.infer<typeof GameInfo>;

export const LiveGameStart = z.object({
  t: z.string(),
  game_id: z.string(),
  game_info: GameInfo
});

export type LiveGameStart = z.infer<typeof LiveGameStart>;

export const LiveGameSfen = z.object({
  t: z.string(),
  game_id: z.string(),
  fen: z.string(),
  current_stage: z.number(),
  variant: z.string()
})

export type LiveGameSfen = z.infer<typeof LiveGameSfen>;

export const PauseConfirmed = z.object({
  t: z.string(),
  confirmed: z.tuple([z.boolean(), z.boolean()])
})

export type PauseConfirmed = z.infer<typeof PauseConfirmed>;

