import { Chessground } from "chessground12";
import type { Api } from "chessground12/api";
import type { Config } from "chessground12/config";
import { userProfileConfig } from "chessground12/configs";
import { dimensions, Geometry } from "chessground12/types";

export function userProfileCg(id: string, variant: string): Api {
  const elem = document.getElementById(id) as HTMLElement;
  const cg = Chessground(elem, userProfileConfig, 500, undefined);
  if (variant.startsWith("standard")) {
    cg.state.variant = "standard";
    cg.state.dimensions = dimensions[1];
    cg.state.geometry = Geometry.dim8x8;
  }
  return cg;
}

export function deployCg(elem: HTMLElement, config: Config, top: HTMLElement, bot: HTMLElement): Api {
  return Chessground(elem, config, 800, top, bot);
}

export function fightCg(elem: HTMLElement, config: Config): Api {
      return Chessground(elem, config) as Api;
}
