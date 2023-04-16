import type { GameInfo } from "./webSocketTypes";
export const pieces = (game: GameInfo): string[] => {
  const pieces = [
    "k-piece",
    "q-piece",
    "r-piece",
    "b-piece",
    "n-piece",
    "p-piece",
    "c-piece",
    "a-piece",
    "g-piece",
  ];

  if (!game.variant.endsWith("Fairy")) {
    return pieces.slice(0, 6);
  }
  return pieces;
};

export const dataPrice = (game: GameInfo): Uint8Array => {
  const data = new Uint8Array([0, 110, 70, 40, 40, 10, 130, 130, 70]);
  if (!game.variant.endsWith("Fairy")) {
    return data.slice(0, 6);
  }
  return data;
};

