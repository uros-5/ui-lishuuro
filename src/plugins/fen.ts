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
