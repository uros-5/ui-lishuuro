export function deploySfen(f: string): string {
  let sfen = f.split("_");
  let fen = sfen[1];
  let hand = sfen[2];
  let stm = sfen[3];
  let ply = sfen[4];
  return `${fen} ${stm} ${hand} ${ply}`;
}

export function fightSfen(f: string): string {
  let sfen = f.split(" ");
  let fen = sfen[0];
  let stm = sfen[1];
  let ply = sfen[3];
  return `${fen} ${stm} - ${ply}`;
}
