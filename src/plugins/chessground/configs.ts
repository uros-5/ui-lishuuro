import { Config } from "./config";

let dests = new Map();
dests.set("a4", ["a6", "a7"]);

export const anonConfig: Config = {
  movable: { free: false },
  draggable: { enabled: false },
  premovable: { enabled: false },
  predroppable: { enabled: false },
};
export const liveConfig: Config = {
  animation: { enabled: true },
  turnColor: "white",
  selectable: { enabled: true },
  drawable: { enabled: true, visible: true },
  draggable: { enabled: true },
  movable: { showDests: true, color: "white", free: false },
};
