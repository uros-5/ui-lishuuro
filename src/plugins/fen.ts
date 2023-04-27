export function deploySfen(f: string): string {
  const sfen = f.split("_");
  const fen = sfen[1];
  const hand = sfen[2];
  const stm = sfen[3];
  const ply = sfen[4];
  return `${fen} ${stm} ${hand} ${ply}`;
}

export function fightSfen(f: string): string {
  const sfen = f.split(" ");
  const fen = sfen[0];
  const stm = sfen[1];
  const ply = sfen[3];
  return `${fen} ${stm} - ${ply}`;
}

export function formatSfen(fen: string): Sfen {
  if (fen.includes("_")) {
    fen = fen.replace("_", "|").split("|")[1].replaceAll("_", " ")
    let parts = fen.split(" ")
    fen = `${parts[0]} ${parts[2]} ${parts[1]} ${parts[3]}}`
  }
  let parts = fen.split(" ");
  return {
    sfen: fen,
    stm: parts[2],
    game_move: parts[4]
  }
}

export type Sfen = {
  sfen: string,
  stm: string,
  game_move: string | undefined
}

export enum FenBtn {
  First,
  Next,
  Previous,
  Last,
}
