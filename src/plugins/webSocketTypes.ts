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

export const LobbyGame = z.object({
  username: z.string(),
  variant: z.string(),
  time: z.number(),
  incr: z.number(),
  color: z.string(),
  t: z.string()
})

export type LobbyGame = z.infer<typeof LobbyGame>;

export const homeLobbyFull = z.object({
  lobbyGames: z.array(LobbyGame)
})

export type homeLobbyFull = z.infer<typeof homeLobbyFull>;

export const activePlayersFull = z.object({
  t: z.string(),
  players: z.array(z.string())
})

export type activePlayersFull = z.infer<typeof activePlayersFull>;

export const tvGame = z.object({
  t: z.string(),
  game_id: z.string(),
  w: z.string(),
  b: z.string(),
  sfen: z.string(),
});

export type tvGame = z.infer<typeof tvGame>;

export const tvGames = z.object({
  t: z.string(),
  games: z.array(tvGame)
});

export type tvGames = z.infer<typeof tvGames>;

export const tvGameUpdate = z.object({
  t: z.string(),
  g: z.any()
});;

export type tvGameUpdate = z.infer<typeof tvGameUpdate>;

export const placeMove = z.object({
  t: z.string(),
  game_move: z.string(),
  game_id: z.string(),
  to_fight: z.boolean(),
  first_move_error: z.boolean(),
  clocks: z.tuple([z.number(), z.number()])
});;

export type placeMove = z.infer<typeof placeMove>;

export const fightMove = z.object({
  t: z.string(),
  game_move: z.string(),
  game_id: z.string(),
  status: z.number(),
  clocks: z.tuple([z.number(), z.number()]),
  outcome: z.string()
});

export type fightMove = z.infer<typeof fightMove>;

export const liveGameEnd = z.object({
  t: z.string(),
  game_id: z.string()
});

export type liveGameEnd = z.infer<typeof liveGameEnd>;


export const liveGameDraw = z.object({
  t: z.string(),
  game_id: z.string(),
  draw: z.number()
})

export type liveGameDraw = z.infer<typeof liveGameDraw>;


export const liveGameResign = z.object({
  t: z.string(),
  game_id: z.string(),
  resign: z.boolean(),
  player: z.string()
})

export type liveGameResign = z.infer<typeof liveGameResign>;



export const ENDED_TYPES = [liveGameResign, liveGameDraw, liveGameEnd];

export const redirectDeploy = z.object({
  t: z.string(),
  path: z.string(),
  hand: z.string(),
  last_clock: z.string(),
  side_to_move: z.string(),
  w: z.string(),
  b: z.string(),
  sfen: z.string()
});

export type redirectDeploy = z.infer<typeof redirectDeploy>;

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

