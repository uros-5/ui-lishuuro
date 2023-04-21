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

export enum FenBtn {
  First,
  Next,
  Previous,
  Last,
}

export function fenIndex(
  t: FenBtn,
  stage: number,
  index: number,
  fn: (stage: number) => string[]
): number {
  switch (t) {
    case FenBtn.First:
      return 0;
    case FenBtn.Next:
      return index + 1;
    case FenBtn.Previous:
      return index - 1;
    case FenBtn.Last:
      return fn(stage).length - 1;
  }
}

export function getFen(
  t: FenBtn,
  stage: number,
  index: number,
  fn: (stage: number) => string[]
): undefined | string {
  if (index <= 0) {
    return undefined;
  }
  let history = fn(stage);
  if (t == FenBtn.First && stage == 2) {
    history = fn(1);
    index = -1;
  }
  return history.at(index);
}
