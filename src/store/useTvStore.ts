import Chessground  from "@/plugins/chessground12";
import type { Api } from "@/plugins/chessground12/api";
import { setCheck } from "@/plugins/chessground12/board";
import { userProfileConfig } from "@/plugins/chessground12/configs";
import { dimensions, Geometry, type Role } from "@/plugins/chessground12/types";
import { defineStore } from "pinia";
import init, { ShuuroPosition } from "@/plugins/shuuro-wasm";
import type { Color } from "./useShuuroStore";
import type { Key, Piece } from "@/plugins/chessground12/types";

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
      this.games = games;
    },

    // creating new cg
    setCg(id: string, variant: string): Api {
      const elem = document.getElementById(id) as HTMLElement;
      const cg = Chessground(elem, userProfileConfig, 500, undefined);
      if (variant == "standard") {
        cg.state.variant = "standard";
        cg.state.dimensions = dimensions[1];
        cg.state.geometry = Geometry.dim8x8;
      }
      return cg;
    },

    // using wasm for setting plinths and pieces
    tempWasm(cg: Api, sfen: string, stage: string, variant: string) {
      init().then((_exports) => {
        const w = new ShuuroPosition(variant);
        const fen = sfen; //this.getFen(sfen, stage);
        w.set_sfen(fen);
        const check = w.is_check();
        const pieces = w.map_pieces();
        const plinths = w.map_plinths();
        const stm = w.side_to_move();
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
      this.profile_game.sfen = msg.fen;
      const cg = this.setCg(msg.game_id as string);
      this.profile_game.cg = cg;
      if (msg.current_stage == 0) {
        return;
      }
      this.profile_game.cs = msg.current_stage;
      this.tempWasm(cg, msg.fen, msg.current_stage);
    },

    // get sfen for wasm
    getFen(sfen: string, current_stage: string): string {
      switch (current_stage) {
        case "deploy":
          const s = sfen.split("_");
          return `${s[1]} ${s[2]} ${s[3]}`;
        case "fight":
          return sfen;
        default:
          return "";
      }
    },

    // set tv game
    setTvGame(id: string) {
      const game = this.game(id);

      const cg = this.setCg(id + "_tv");
      const wasm = this.tempWasm(cg, game.sfen, "");
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
      } else if (msg.t.endsWith("redirect_deploy")) {
        const game = this.newGame(msg);
        this.games.push(game);
      } else if (ENDED.includes(msg.t)) {
        const self = this;
        setTimeout(function () {
          self.removeGame(msg.game_id);
        }, 350);
      }
    },

    // create new game when deploy is ready
    newGame(msg: any): TvGame {
      const path = msg.path.split("/1/")[1];
      const game = empty_game(path);
      game.w = msg.w;
      game.b = msg.b;
      game.sfen = msg.sfen;
      game.stage = 1;
      return game;
    },

    // remove game from store
    removeGame(id: string) {
      this.games = this.games.filter(
        (item) => item.game_id != id
      );
    },

    // placing
    tvPlace(msg: any) {
      const game = this.game(msg.game_id);
      const cg = game.cg as Api;
      const place = msg.move.split("@");
      const piece = place[0];
      const sq = place[1];
      const color: Color = piece == piece.toUpperCase() ? "white" : "black";

      const pieceObj = {
        role: `${piece.toLowerCase()}-piece` as Role,
        color: color,
      };
      cg.newPiece(pieceObj, sq);
    },

    // move
    tvMove(msg: any) {
      const move = msg.game_move.split("_");
      const game = this.game(msg.game_id);
      game.cg.move(move[0] as Key, move[1] as Key);
      if (this.isPromotion(game.cg, msg)) {
        const color = move[1].endsWith("2") ? "white" : "black";
        const pieceObj = {
          role: "q-piece" as Role,
          color: color,
        };
        const cg = game.cg as Api;
        const pieces = cg.state.pieces;
        pieces.delete(move[1]);
        pieces.set(move[1], pieceObj as Piece);
        (game.cg as Api).state.dom.redraw();
      }
    },

    // is promotion
    isPromotion(game: Api, msg: any): boolean {
      const move = msg.game_move.split("_");
      const piece = game.state.pieces.get(move[1] as Key);
      if (!this.isPawn(piece)) return false;
      const rank = this.getRank(piece!.color);
      if (move[0].endsWith(`${rank[0]}`))
        if (move[1].endsWith(`${rank[1]}`)) return true;
      return false;
    },

    // GETTERS
    game(id: string): TvGame {
      return this.games.find((item) => item.game_id == id) as TvGame;
    },

    // not a piece
    isPawn(piece: Piece | undefined): boolean {
      if (piece == undefined || piece.role != "p-piece") return false;
      return true;
    },

    // get ranks
    getRank(color: Color | "none"): [number, number] {
      return color == "white" ? [11, 12] : [2, 1];
    },
  },
});

export interface TvGame {
  b: string;
  w: string;
  sfen: string;
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
    sfen: "",
    pl_set: false,
    pieces_set: false,
    cs: 0,
  };
}

const ENDED = [
  "live_game_end",
  "live_game_resign",
  "live_game_lot",
  "live_game_draw",
];
