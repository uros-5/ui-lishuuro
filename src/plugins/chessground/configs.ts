import { Config } from "./config";
import { PieceLetter } from "./types";
import { Color } from "./types";
import * as cg from "./types";

const dests = new Map();
dests.set("a4", ["a6", "a7"]);

export const anonConfig: Config = {
  movable: { free: false, showDests: false },
  draggable: { enabled: false },
  drawable: { enabled: true, visible: true },
  premovable: { enabled: false },
  predroppable: { enabled: false },
  pocketRoles: p
};
export const liveConfig: Config = {
  animation: { enabled: true },
  turnColor: "white",
  selectable: { enabled: true },
  drawable: { enabled: true, visible: true },
  draggable: { enabled: true },
  movable: {
    showDests: true,
    color: "black",
    free: false,
  },
  events: {
    dropNewPiece: pieceDropped,
    pocketSelect: select2,
  },
  pocketRoles: p,
};

export const liveFightConfig: Config = {
  animation: { enabled: true },
  turnColor: "white",
  selectable: { enabled: true },
  drawable: { enabled: true, visible: true },
  draggable: { enabled: true },
  movable: {
    showDests: true,
    color: "black",
    free: false,
  },
  events: {
    dropNewPiece: pieceDropped,
    pocketSelect: select2,
  },
  pocketRoles: p,
};

export const userProfileConfig: Config = {
  selectable: { enabled: false },
  drawable: { enabled: false, visible: false },
  draggable: { enabled: false },
  movable: { showDests: false, free: false },
  coordinates: false,
};

export function p(color: Color): PieceLetter[] {
  if (color == "white") {
    return ["K", "Q", "R", "B", "N", "P"];
  } else if (color == "black") {
    return ["k", "q", "r", "b", "n", "p"];
  }
  return [];
}

export function pieceDropped(piece: cg.Piece, key: cg.Key) {
  console.log(piece, key);
}

export function select2(key: cg.Piece) {
  console.log(key);
}
