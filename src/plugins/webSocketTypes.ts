export interface liveChatMessage {
  id: string;
  user: string;
  time: string;
  message: string;
}

export interface liveChatFull {
  id: string;
  lines: string[];
}

export interface activePlayersFull {
  players: string[];
}

export interface activePlayersCnt {
  cnt: number;
}

export interface homeLobbyAdd {
  username: string;
  variant: string;
  time: number;
  incr: number;
  color: string;
}

export interface homeLobbyFull {
  lobbyGames: homeLobbyAdd[];
}

export interface homeLobbyRemoveByUser {
  username: string;
}

export interface liveGameStart {
  game_id: string;
  game_info: {};
}
