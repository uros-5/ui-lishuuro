import { Config } from "./config";
import { PieceLetter } from "./types";
import { Color } from "./types";

const dests = new Map();
dests.set("a4", ["a6", "a7"]);

export const anonConfig: Config = {
  movable: { free: false },
  draggable: { enabled: false },
  premovable: { enabled: false },
  predroppable: { enabled: false },
};
export const liveConfig: Config = {
  animation: { enabled: true },
  turnColor: "black",
  selectable: { enabled: true },
  drawable: { enabled: true, visible: true },
  draggable: { enabled: true },
  movable: { showDests: true, color: "both", free: false },
  pocketRoles: function (color: Color): PieceLetter[] {
    if (color == "white") {
      return ["K", "Q", "R", "B", "N", "P"];
    } else if (color == "black") {
      return ["k", "q", "r", "b", "n", "p"];
    }
    return [];
  },
};
