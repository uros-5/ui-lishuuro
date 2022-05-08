import Chessground from "@/plugins/chessground";
import { Api } from "@/plugins/chessground/api";
import { setCheck } from "@/plugins/chessground/board";
import { userProfileConfig } from "@/plugins/chessground/configs";
import { Role } from "@/plugins/chessground/types";
import { defineStore } from "pinia";
import init, { ShuuroPosition } from "shuuro-wasm";
import { Color } from "./useShuuroStore2";
import { Key, MoveMetadata, Piece } from "@/plugins/chessground/types";

export const useTvStore = defineStore("tvStore", {
  state: (): TvStore => {
    return {
      games: [],
      profile_game: empty_game(""),
      init_done: false,
    };
  },
  actions: {
    // set games from server
    setGames(games: TvGame[]) {
      this.$state.games = games;
    },

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

    // set tv game
    setTvGame(id: string) {
      let game = this.game(id);
      console.log(`${id}_tv`);
      let cg = this.setCg(id + "_tv");
      let wasm = this.tempWasm(cg, game.fen, "");
      game.cg = cg;
      game.pl_set = true;
      game.pieces_set = true;
    },

    // from server update
    tvGameUpdate(msg: any) {
      if (msg.t.endsWith("place")) {
        this.tvPlace(msg);
      } else if (msg.t.endsWith("play")) {
        this.tvMove(msg);
      }
    },

    // placing
    tvPlace(msg: any) {
      let game = this.game(msg.game_id);
      let cg = game.cg as Api;
      let place = msg.move.split("@");
      let piece = place[0];
      let sq = place[1];
      let color: Color = piece == piece.toUpperCase() ? "white" : "black";

      let pieceObj = {
        role: `${piece.toLowerCase()}-piece` as Role,
        color: color,
      };
      cg.newPiece(pieceObj, sq);
      console.log(pieceObj, sq);
      console.log(this.game(msg.game_id));
    },

    // move
    tvMove(msg: any) {
      let move = msg.game_move.split("_");
      let game = this.game(msg.game_id);
      game.cg.move(move[0] as Key, move[1] as Key);
    },

    // GETTERS
    game(id: string): TvGame {
      return this.$state.games.find((item) => item.game_id == id) as TvGame;
    },
  },
});

export interface TvGame {
  b: string;
  w: string;
  fen: string;
  stage: number;
  game_id: string;
  pl_set?: boolean;
  pieces_set?: boolean;
  cg?: Api | any;
  cs?: number;
}

export interface TvStore {
  games: TvGame[];
  profile_game: TvGame;
  init_done: boolean;
}

export function empty_game(id: string): TvGame {
  return {
    game_id: id,
    stage: 1,
    b: "",
    w: "",
    fen: "",
    pl_set: false,
    pieces_set: false,
    cs: 0,
  };
}
