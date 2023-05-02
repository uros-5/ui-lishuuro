import { Chessground } from "chessground12";
import type { Api } from "chessground12/api";
import { setCheck } from "chessground12/board";
import { userProfileConfig } from "chessground12/configs";
import {
  dimensions,
  Geometry,
  type Color,
  type Role,
} from "chessground12/types";
import { defineStore } from "pinia";
import init, { ShuuroPosition } from "shuuro-wasm";
import type { Key, Piece } from "chessground12/types";
import {
  LiveGameDraw,
  LiveGameFight,
  LiveGameEnd,
  LiveGameResign,
  LiveGamePlace,
  type TvGameUpdate,
  LiveGameSfen,
  TvGame,
  RedirectDeploy,
} from "@/plugins/webSocketTypes";

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
      if (variant.startsWith("standard")) {
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
    setProfileGame(msg: LiveGameSfen) {
      this.profile_game.game_id = msg.game_id;
      this.profile_game.sfen = msg.fen;
      const cg = this.setCg(msg.game_id as string, msg.variant);
      this.profile_game.cg = cg;
      if (msg.current_stage == 0) {
        return;
      }
      this.profile_game.cs = msg.current_stage;
      this.tempWasm(cg, msg.fen, "", msg.variant);
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
    setTvGame(id: string, variant: string) {
      const game = this.game(id);
      if (game == undefined) {
        return;
      }
      const cg = this.setCg(id + "_tv", variant);
      const wasm = this.tempWasm(cg, game.sfen, "", variant);
      game.cg = cg;
      game.pl_set = true;
      game.pieces_set = true;
    },

    // from server update
    tvGameUpdate(msg: TvGameUpdate) {
      if (msg.t.endsWith("place")) {
        const place = LiveGamePlace.parse(msg.data);
        this.tvPlace(place);
      } else if (msg.t.endsWith("play")) {
        const play = LiveGameFight.parse(msg.data);
        this.tvMove(play);
      } else if (msg.t.endsWith("redirect_deploy")) {
        const game = this.newGame(RedirectDeploy.parse(msg.data));
        this.games.push(game);
      } else if (ENDED.includes(msg.t)) {
        const self = this;
        const over = isGameOver(msg.data);
        if (over[0]) {
          setTimeout(function () {
            self.removeGame(over[1]);
          }, 350);
        }
      }
    },

    // create new game when deploy is ready
    newGame(msg: RedirectDeploy): TvGame {
      const path = msg.path.split("/1/")[1];
      const game = empty_game(path);
      game.w = msg.w;
      game.b = msg.b;
      game.sfen = msg.sfen;
      game.stage = 1;
      game.variant = msg.variant;
      return game;
    },

    // remove game from store
    removeGame(id: string) {
      this.games = this.games.filter((item) => item.game_id != id);
    },

    // placing
    tvPlace(msg: LiveGamePlace) {
      const game = this.game(msg.game_id);
      if (game == undefined) {
        return;
      }
      const cg = game.cg as Api;
      const place = msg.game_move.split("@");
      const piece = place[0];
      const sq = place[1];
      const color: Color = piece == piece.toUpperCase() ? "white" : "black";

      const pieceObj = {
        role: `${piece.toLowerCase()}-piece` as Role,
        color: color,
      };
      cg.newPiece(pieceObj, sq as Key);
    },

    // move
    tvMove(msg: LiveGameFight) {
      const move = msg.game_move.split("_");
      const game = this.game(msg.game_id);
      if (game == undefined) {
        return;
      }
      game.cg.move(move[0] as Key, move[1] as Key);
      if (this.isPromotion(game.cg, msg)) {
        const color = move[1].endsWith("*") ? "white" : "black";
        const pieceObj = {
          role: "q-piece" as Role,
          color: color,
        };
        const cg = game.cg as Api;
        const pieces = cg.state.pieces;
        pieces.delete(move[1] as Key);
        pieces.set(move[1] as Key, pieceObj as Piece);
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
    game(id: string): TvGame | undefined {
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
    variant: "",
  };
}

const ENDED = [
  "live_game_end",
  "live_game_resign",
  "live_game_lot",
  "live_game_draw",
];

function isGameOver(game: any): [boolean, string] {
  // export const ENDED_TYPES = [liveGameResign, liveGameDraw, liveGameEnd];
  if (LiveGameResign.safeParse(game).success) {
    return [true, game.game_id];
  } else if (LiveGameDraw.safeParse(game).success) {
    return [true, game.game_id];
  } else if (LiveGameEnd.safeParse(game).success) {
    return [true, game.game_id];
  }

  return [false, ""];
}
