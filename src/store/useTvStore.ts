import Chessground from "@/plugins/chessground";
import { Api } from "@/plugins/chessground/api";
import { setCheck } from "@/plugins/chessground/board";
import { userProfileConfig } from "@/plugins/chessground/configs";
import { defineStore } from "pinia";
import init, { ShuuroPosition } from "shuuro-wasm";

export const useTvStore = defineStore("tvStore", {
  state: (): TvStore => {
    return {
      games: [],
      profile_game: empty_game(""),
      init_done: false,
    };
  },
  actions: {
    // creating new cg
    setCg(id: string): Api {
      const elem = document.getElementById(id) as HTMLElement;
      const cg = Chessground(elem, userProfileConfig, 500, undefined);
      return cg;
    },

    // using wasm for setting plinths and pieces
    tempWasm(cg: Api, sfen: string, stage: string) {
      init().then((_exports) => {
        let w = new ShuuroPosition();
        let fen = sfen; //this.getFen(sfen, stage);
        w.set_sfen(fen);
        let check = w.is_check();
        let pieces = w.map_pieces();
        let plinths = w.map_plinths();
        let stm = w.side_to_move();
        cg.state.turnColor = stm == "w" ? "white" : "black";
        cg.state.plinths = plinths;
        cg.state.pieces = pieces;
        setCheck(cg.state, check);
        cg.state.dom.redraw();
        cg.state.dom.redrawNow();
        cg.state.turnColor = "none";
        w.free();
      });
    },

    // from server set profileGame
    setProfileGame(msg: any) {
      this.profile_game.game_id = msg.game_id;
      this.profile_game.fen = msg.fen;
      let cg = this.setCg(msg.game_id as string);
      this.profile_game.cg = cg;
      if (msg.current_stage == "shop") {
        return;
      }
      this.profile_game.cs = msg.current_stage;
      this.tempWasm(cg, msg.fen, msg.current_stage);
    },

    // get fen for wasm
    getFen(sfen: string, current_stage: string): string {
      switch (current_stage) {
        case "deploy":
          let s = sfen.split("_");
          return `${s[1]} ${s[2]} ${s[3]}`;
        case "fight":
          return sfen;
        default:
          return "";
      }
    },
  },
});

export interface TvGame {
  game_id: string;
  pl_set: boolean;
  pieces_set: boolean;
  fen?: string;
  cg?: Api | any;
  cs?: number;
}

export interface TvStore {
  games: TvGame[];
  profile_game: TvGame;
  init_done: boolean;
}

export function empty_game(id: string): TvGame {
  return { game_id: id, pl_set: false, pieces_set: false, cs: 0 };
}
