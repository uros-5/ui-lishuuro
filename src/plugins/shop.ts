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

export const dataMax = (game: GameInfo): Uint8Array => {
  const data = new Uint8Array([1, 3, 6, 9, 9, 18, 3, 3, 4]);
  if (game.variant.startsWith("standard")) {
    data[5] = 12;
  }
  if (!game.variant.endsWith("Fairy")) {
    return data.slice(0, 6);
  }
  return data;
};
