import { Chessground } from "chessground12";
import { Api } from "chessground12/api";
import { setCheck } from "chessground12/board";
import { userProfileConfig } from "chessground12/configs";
import { Role } from "chessground12/types";
import { defineStore } from "pinia";
import init, { ShuuroPosition } from "shuuro-wasm";
import { Color } from "./useShuuroStore2";
import { Key, MoveMetadata, Piece } from "chessground12/types";

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
      this.profile_game.sfen = msg.sfen;
      let cg = this.setCg(msg.game_id as string);
      this.profile_game.cg = cg;
      if (msg.current_stage == "shop") {
        return;
      }
      this.profile_game.cs = msg.current_stage;
      this.tempWasm(cg, msg.sfen, msg.current_stage);
    },

    // get sfen for wasm
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

      let cg = this.setCg(id + "_tv");
      let wasm = this.tempWasm(cg, game.sfen, "");
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
        let game = this.newGame(msg);
        this.$state.games.push(game);
      } else if (ENDED.includes(msg.t)) {
        let self = this;
        setTimeout(function () {
          self.removeGame(msg.game_id);
        }, 350);
      }
    },

    // create new game when deploy is ready
    newGame(msg: any): TvGame {
      let path = msg.path.split("/1/")[1];
      let game = empty_game(path);
      game.w = msg.w;
      game.b = msg.b;
      game.sfen = msg.sfen;
      game.stage = 1;
      return game;
    },

    // remove game from store
    removeGame(id: string) {
      this.$state.games = this.$state.games.filter(
        (item) => item.game_id != id
      );
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
    },

    // move
    tvMove(msg: any) {
      let move = msg.game_move.split("_");
      let game = this.game(msg.game_id);
      game.cg.move(move[0] as Key, move[1] as Key);
      if (this.isPromotion(game.cg, msg)) {
        let color = move[1].endsWith("2") ? "white" : "black";
        let pieceObj = {
          role: "q-piece" as Role,
          color: color,
        };
        let cg = game.cg as Api;
        let pieces = cg.state.pieces;
        pieces.delete(move[1]);
        pieces.set(move[1], pieceObj as Piece);
        (game.cg as Api).state.dom.redraw();
      }
    },

    // is promotion
    isPromotion(game: Api, msg: any): boolean {
      let move = msg.game_move.split("_");
      let piece = game.state.pieces.get(move[1] as Key);
      if (!this.isPawn(piece)) return false;
      let rank = this.getRank(piece!.color);
      if (move[0].endsWith(`${rank[0]}`))
        if (move[1].endsWith(`${rank[1]}`)) return true;
      return false;
    },

    // GETTERS
    game(id: string): TvGame {
      return this.$state.games.find((item) => item.game_id == id) as TvGame;
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
