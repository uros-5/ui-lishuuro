export function from1to2(f: string): string {
  const sfen = f.split("_");
  const move = sfen[0].replace("@", "_");
  const fen = sfen[1];
  let hand = sfen[2];
  hand = sfen[2] == " " ? "-" : sfen[2];
  const stm = sfen[3];
  const ply = sfen[4];
  return `${fen} ${stm} ${hand} ${ply} ${move}`;
}

export function formatSfen(fen: string): Sfen {
  if (fen.includes("@")) {
    fen = from1to2(fen);
  }
  const parts = fen.split(" ");
  const capture = fen.includes("x") ? true : false;
  return {
    sfen: fen,
    stm: parts[1],
    game_move: parts[4],
    capture
  };
}

export type Sfen = {
  sfen: string;
  stm: string;
  game_move: string | undefined;
  capture: boolean;
};

export enum FenBtn {
  First,
  Next,
  Previous,
  Last,
}
