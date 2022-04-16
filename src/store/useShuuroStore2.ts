import { defineStore } from "pinia";
import init, { ShuuroShop, ShuuroPosition } from "shuuro-wasm";
import { Clock } from "@/plugins/clock";
import Chessground from "@/plugins/chessground";
import router from "@/router";
import { ServerDate } from "@/plugins/serverDate";
import { SEND } from "@/plugins/webSockets";
import {
  anonConfig,
  liveConfig,
  liveFightConfig,
} from "@/plugins/chessground/configs";
import { Api } from "@/plugins/chessground/api";
import { readPockets } from "@/plugins/chessground/pocket";
import { Key, MoveMetadata, Piece } from "@/plugins/chessground/types";

export const useShuuroStore2 = defineStore("shuuro2", {
  state: (): ShuuroStore => {
    return emptyState();
  },
  actions: {
    // convert server data to store
    fromServer(s: any, username: string) {
      this.$state.game_id = s.game_id;
      this.$state.min = s.min;
      this.$state.incr = s.incr;
      this.$state.side_to_move = s.side_to_move[0] == "w" ? 0 : 1;
      this.$state.last_clock = s.last_clock;
      this.$state.current_stage = s.current_stage;
      this.$state.client_stage = s.current_stage;
      this.$state.result = s.result;
      this.$state.status = s.status;
      this.$state.shop_history = s.shop_history;
      this.$state.deploy_history = s.deploy_history;
      this.$state.fight_history = s.fight_history;
      this.$state.players = [s.white, s.black];
      this.$state.clocks = [
        new Clock(s.min / 60000, s.incr / 1000, 0, "1"),
        new Clock(s.min / 60000, s.incr / 1000, 0, "0"),
      ];
      this.$state.credits = [s.white_credit, s.black_credit];
      this.$state.clock_ms = [s.white_clock, s.black_clock];
      this.setPlayer(username);
      this.$state.flipped_board = this.$state.player == 1 ? true : false;
      this.$state.credit =
        this.$state.player == 0
          ? this.$state.credits[0]
          : this.$state.credits[1];
      this.$state.player_color = this.getColor(username) as Color;
      this.$state.confirmed_players = [false, false];
      this.$state.sfen = s.sfen;
      this.setWasm();
      router.push({ path: `/shuuro/${s.current_stage}/${s.game_id}` });
      let stage = this.$state.current_stage;
      if (s.current_stage == "shop") {
        this.shopInfo();
      } else if (stage == "deploy") {
        this.setDeployCg();
        this.setDeployWasm(s.sfen);
      } else if (stage == "fight") {
        this.setFightCg();
        this.setFightWasm(s.sfen);
      }
    },

    // set wasm for all stages
    setWasm(): void {
      // eslint-disable-next-line
      init().then((_exports) => {
        if (!this.$state.shop_wasm) {
          this.$state.shop_wasm = new ShuuroShop();
        } else if (!this.$state.deploy_wasm) {
          this.$state.deploy_wasm = new ShuuroPosition();
        } else {
          this.$state.fight_wasm = new ShuuroPosition();
        }
      });
    },

    // set player(if any)
    setPlayer(username: string) {
      if (username == this.$state.players[0]) {
        this.$state.player = 0;
        this.am_i_player = true;
      } else if (username == this.$state.players[1]) {
        this.$state.player = 1;
        this.am_i_player = true;
      } else {
        this.am_i_player = false;
      }
    },

    // new stage for game
    updateClientStage(stage: Stage): void {
      this.$state.client_stage = stage;
    },

    // SHOP PARTS

    // get hand and confirmed_players
    shopInfo(): void {
      SEND({
        t: "live_game_hand",
        color: this.$state.player_color,
        game_id: this.$state.game_id,
      });
      SEND({
        t: "live_game_confirmed",
        color: this.$state.player_color,
        game_id: this.$state.game_id,
      });
    },

    // get from server confirmed and set
    setConfirmed(data: [boolean, boolean]) {
      this.$state.confirmed_players = data;
      this.activateClock();
    },

    // buying piece
    buy(p: string, color: string) {
      if (this.canShop()) {
        this.$state.piece_counter = this.$state.shop_wasm.buy(p);
        const new_credit = this.$state.shop_wasm.getCredit(color);
        console.log(new_credit);
        const counter = this.$state.shop_wasm.get_piece(p);
        const game_move = `+${p}`;
        if (new_credit != this.$state.credit) {
          this.$state.shop_history?.push([game_move, counter]);
        }
        SEND({
          t: "live_game_buy",
          game_id: this.$state.game_id,
          game_move: game_move,
        });
        this.$state.current_index = this.$state.shop_history?.length! - 1;
        this.$state.credit! = new_credit;
      }
    },

    // confirm shopping list
    confirm(username: string) {
      if (this.canShop()) {
        this.$state.shop_wasm.confirm(this.$state.player_color);
        if (this.$state.shop_wasm.isConfirmed(this.$state.player_color)) {
          SEND({
            t: "live_game_confirm",
            game_id: this.$state.game_id,
            game_move: "cc",
          });
          this.clockPause(this.$state.player!);
          this.$state.confirmed_players![this.$state.player!] = true;
        }
      }
    },

    // DEPLOY PART

    // set deploy chessground
    setDeployCg() {
      const config = this.$state.am_i_player ? liveConfig : anonConfig;
      const elem = document.querySelector(".chessground12") as HTMLElement;
      const top = document.querySelector("#pocket0") as HTMLElement;
      const bot = document.querySelector("#pocket1") as HTMLElement;
      this.$state.deploy_cground = Chessground(
        elem,
        config,
        800,
        top,
        bot
      ) as Api;
      this.$state.player! == 1
        ? this.deployCground().toggleOrientation()
        : null;
      this.deployCground().redrawAll();
      this.deployCground().state.events.dropNewPiece = this.decrementPocket;
    },

    // decrement pocket item number
    decrementPocket(piece: Piece, key: Key) {
      // wasmPlace
      let p = this.shuuroPiece(piece);
      this.sendPlace(p, key);
      this.wasmPlace(p, key);
      this.setTurnColor();
    },

    // set pocket
    setPocket(s: string | undefined) {
      if (s == undefined) {
        return;
      }

      this.deployCground().state.pockets = readPockets(
        `[${s}]`,
        this.deployCground().state.pocketRoles!
      );
      this.deployCground().redrawAll();
    },

    // send place move to server
    sendPlace(p: string, key: Key) {
      let sfen = `${p}@${key}`;
      SEND({
        t: "live_game_place",
        game_id: this.$state.game_id,
        game_move: sfen,
      });
    },

    // receive move from server and place on board
    serverMove(msg: any) {
      let a = this.deployWasm().server_place(msg.move);
      if (a) {
        this.setPieces();
        this.setTurnColor();
        this.switchClock();
        this.updateCgHand();
        this.$state.deploy_history!.push([msg.game_move, 0]);
        this.$state.sfen = this.deployWasm().generate_sfen();
      }
      if (msg.to_fight) {
        this.$state.current_stage = "fight";
        this.$state.client_stage = "fight";
        router.push({ path: `/shuuro/fight/${this.$state.game_id}` });
      }
    },

    // deploy_wasm placing piece
    wasmPlace(p: string, key: Key) {
      let placed = this.deployWasm().place(p, key);
      if (placed) {
        this.updateCgHand();
        this.$state.sfen = this.deployWasm().generate_sfen();
      }
    },

    // updating cgHand after placing
    updateCgHand() {
      let hand = this.deployWasm().count_hand_pieces();
      this.deployCground().state.pockets = readPockets(
        `[${hand}]`,
        this.deployCground().state.pocketRoles!
      );
    },

    // after shop redirect to deploy
    redirectDeploy(s: any) {
      this.$state.last_clock = s.last_clock;
      this.$state.sfen = s.sfen;
      router.push({ path: s.path });
      this.$state.side_to_move = s.side_to_move[0] == "w" ? 0 : 1;
      this.clock(this.$state.side_to_move).start();
      this.$state.current_stage = "deploy";
      //this.setShuuroHand(s.hand, "");
    },

    setDeployWasm(sfen: string) {
      init().then((_exports) => {
        this.$state.deploy_wasm = new ShuuroPosition();
        this.deployWasm().set_sfen(sfen);
        let hand = this.deployWasm().count_hand_pieces();
        this.setPocket(hand);
        this.setPlinths();
        this.setPieces();
        this.activateClock();
        this.deployCground().state.movable.color = this.$state.player_color;
        this.deployCground().state.events!.pocketSelect! = this.pocketSelect;
        this.setTurnColor();

        // find plinths pieces and set cg
        // set stm
      });
    },

    // FIGHT PART

    // set fight chessground
    setFightCg() {
      const element = document.querySelector(".chessground12") as HTMLElement;
      const config = this.$state.am_i_player ? liveFightConfig : anonConfig;
      this.$state.fight_cground = Chessground(element!, config) as Api;
      this.$state.player! == 1 ? this.fightCground().toggleOrientation() : null;
      this.fightCground().state.events.select = this.selectSq;
      this.fightCground().state.movable.events.after = this.movedPiece;
      this.fightCground().redrawAll();
    },

    // select square
    selectSq(key: Key) {
      if (this.canPlay()) {
        let moves = this.fightWasm().legal_moves(key);
        let map = new Map();
        map.set(key, moves);
        this.fightCground().state.movable.dests = map;
      }
    },

    // after moving
    movedPiece(orig: Key, dest: Key, _metadata: MoveMetadata) {
      let played = this.fightWasm().play(orig, dest);
      console.log(this.fightWasm().generate_sfen());
      this.sendMove(`${orig}_${dest}`);
    },

    // send move to server
    sendMove(s: string) {
      SEND({
        t: "live_game_play",
        game_move: s,
        game_id: this.$state.game_id,
      });
    },

    // set turn color
    setTurnColor() {
      let stm = "white";
      if (this.$state.client_stage == "deploy") {
        stm = this.deployWasm().side_to_move();
        this.deployCground().state.turnColor = stm == "w" ? "white" : "black";
      } else if (this.$state.client_stage == "fight") {
        stm = this.fightWasm().side_to_move();
        this.fightCground().state.turnColor = stm == "w" ? "white" : "black";
      }
      this.$state.side_to_move = stm == "w" ? 0 : 1;
      this.switchClock();
    },

    // set plinths
    setPlinths() {
      if (this.$state.client_stage == "deploy") {
        let plinths = this.deployWasm().map_plinths();
        this.deployCground().state.plinths = plinths;
        this.deployCground().redrawAll();
      } else if (this.$state.client_stage == "fight") {
        let plinths = this.fightWasm().map_plinths();
        this.fightCground().state.plinths = plinths;
        this.fightCground().redrawAll();
      }
    },

    // set pieces
    setPieces() {
      if (this.$state.client_stage == "deploy") {
        let pieces = this.deployWasm().map_pieces();
        this.deployCground().setPieces(pieces);
        this.deployCground().state.dom.redraw();
      } else if (this.$state.client_stage == "fight") {
        let pieces = this.fightWasm().map_pieces();
        this.fightCground().state.pieces = pieces;
        this.fightCground().state.dom.redraw();
      }
    },

    serverMove2(msg: any) {
      let m = this.fightWasm().server_move(msg.game_move);
      console.log(m);
      this.setPieces();
      this.setTurnColor();
      this.switchClock();
      this.$state.fight_history!.push([msg.game_move, 0]);
      this.$state.sfen = this.fightWasm().generate_sfen();
      this.fightCground().state.dom.redraw();
    },

    // CLOCKS PART
    pauseConfirmed(data: [boolean, boolean]) {
      this.$state.confirmed_players = data;
      let confirmed = this.$state.confirmed_players?.findIndex(
        (item) => item == true
      );
      if (confirmed != -1) {
        this.clockPause(confirmed);
      }
    },

    // start both clocks
    startBoth(elapsed: number) {
      this.$state.clock_ms[0] -= elapsed;
      this.$state.clock_ms[1] -= elapsed;
      this.clock(0).start(this.$state.clock_ms[0]);
      this.clock(1).start(this.$state.clock_ms[1]);
    },

    // start game glocks
    startNormal(elapsed: number) {
      this.$state.clock_ms[this.$state.side_to_move] -= elapsed;
      this.clock(this.$state.side_to_move).start(
        this.$state.clock_ms[this.$state.side_to_move]
      );
      let otherClock = this.$state.side_to_move == 0 ? 1 : 0;
      this.clock(otherClock).setTime(this.$state.clock_ms[otherClock]);
      this.clockPause(otherClock);
    },

    // start clocks
    activateClock(): void {
      this.clock(0).onTick(this.clock(0).renderTime);
      this.clock(1).onTick(this.clock(1).renderTime);
      let elapsed = this.elapsed();
      if (this.$state.status < 0) {
        if (this.$state.current_stage == "shop") {
          let confirmed = this.$state.confirmed_players?.findIndex(
            (item) => item == true
          );
          let otherClock;
          if (confirmed != -1) {
            this.clock(confirmed!).setTime(this.$state.clock_ms[confirmed!]);
            this.clockPause(confirmed!);
            this.clock(confirmed!).pause(false);
            otherClock = confirmed == 0 ? 1 : 0;
            this.$state.clock_ms[otherClock] -= elapsed;
            this.clock(otherClock).start(this.$state.clock_ms[otherClock]);
            return;
          }
          this.startBoth(elapsed);
        } else {
          this.startNormal(elapsed);
        }
      }
    },

    // pause one of clocks
    clockPause(id: number) {
      this.clock(id).pause(true);
    },

    // pause current and start another clock
    switchClock() {
      let otherClock = this.$state.side_to_move == 0 ? 1 : 0;
      this.clock(otherClock).pause(true);
      this.clock(this.$state.side_to_move).start();
    },

    // elapsed time since last clock
    elapsed(): number {
      const now = new Date();
      const converted_date = ServerDate(this.$state.last_clock!);
      const elapsed = now.getTime() - converted_date.getTime();
      return elapsed;
    },

    // redirect player
    redirect(path: string) {
      if (path != undefined) {
        router.push({ path: path });
      }
    },

    dropPiece() {},

    setFightWasm(sfen: string) {
      init().then((_exports) => {
        this.$state.fight_wasm = new ShuuroPosition();
        this.fightWasm().set_sfen(sfen);
        this.setPlinths();
        this.setPieces();
        this.activateClock();
        this.fightCground().state.movable.color = this.$state.player_color;
        this.setTurnColor();
      });
    },

    // set user hand
    setShuuroHand(hand: string, user: string): void {
      // eslint-disable-next-line
      init().then((_exports) => {
        if (this.$state.current_stage == "shop") {
          this.$state.shop_wasm = new ShuuroShop();
          (this.$state.shop_wasm as ShuuroShop).set_hand(hand);
          this.$state.piece_counter = this.$state.shop_wasm.shop_items(
            this.$state.player_color
          );
        }
      });
    },

    pocketSelect(piece: Piece) {
      if (this.$state.side_to_move != this.$state.player) {
        return;
      }
      let ch =
        piece.color == "white"
          ? piece.role[0].toUpperCase()
          : piece.role[0].toLowerCase();
      let moves = this.deployWasm().place_moves(ch);
      this.deployCground().state.movable!.dests = moves;
      console.log(moves);
    },

    // GETTERS
    clock(id: number): Clock {
      return this.$state.clocks[id] as Clock;
    },

    myClock(): Clock {
      return this.$state.clocks[this.$state.player!];
    },

    amIConfirmed(): boolean {
      return this.$state.confirmed_players![this.$state.player!];
    },

    deployCground(): Api {
      return this.$state.deploy_cground!;
    },

    fightCground(): Api {
      return this.$state.fight_cground!;
    },

    canPlay(): boolean {
      if (this.$state.side_to_move == this.$state.player) {
        return true;
      }
      return false;
    },

    canConfirm1(): boolean {
      return this.$state.am_i_player! && this.$state.current_stage == "shop";
    },

    shuuroPiece(piece: Piece): string {
      let p =
        this.$state.player! == 0
          ? piece.role[0].toUpperCase()
          : piece.role[0].toLowerCase();
      return p;
    },

    getColor(username: string): string {
      let index = this.$state.players.findIndex((item) => item == username)!;
      return index == 0 ? "white" : "black";
    },

    getSfen(): string | undefined {
      if (this.$state.sfen) {
        return this.$state.sfen.split(" ")[2];
      }
      return undefined;
    },

    getHistory(): FenItem[] | undefined {
      switch (this.client_stage) {
        case "shop":
          return this.shop_history;
        case "deploy":
          return this.deploy_history;
        case "fight":
          return this.fight_history;
      }
    },

    shopWasm(): ShuuroShop {
      return this.$state.shop_wasm as ShuuroShop;
    },

    deployWasm(): ShuuroPosition {
      return this.$state.deploy_wasm as ShuuroPosition;
    },
    fightWasm(): ShuuroPosition {
      return this.$state.fight_wasm as ShuuroPosition;
    },
    canShop(): boolean {
      return (
        this.$state.am_i_player! &&
        this.$state.current_stage! == "shop" &&
        !this.amIConfirmed()
      );
    },
  },
});

function emptyState(): ShuuroStore {
  return {
    min: 0,
    incr: 0,
    players: ["", ""],
    clocks: [0, 0],
    hands: ["", ""],
    credits: [0, 0],
    clock_ms: [0, 0],
    confirmed_players: [false, false],
    current_stage: "shop",
    result: "",
    status: -2,
    game_started: "",
    game_id: "",
    rated_game: false,
    side_to_move: 0,
    player_color: "white",
    current_fen: "",
    flipped_board: false,
    client_stage: "shop",
    am_i_player: false,
    // SHOP PART
    shop_history: [],
    credit: 800,
    piece_counter: [1, 0, 0, 0, 0, 0, 0],
    //DEPLOY PART
    deploy_history: [],
    deploy_wasm: {},
    //FIGHT PART
    fight_history: [],
    fight_move_history: [],
    fight_wasm: {},
    current_index: 0,
  };
}

export interface ShuuroStore {
  min: number;
  incr: number;
  players: [string, string];
  clocks: [Clock | any, Clock | any];
  hands: [string, string];
  clock_ms: [number, number];
  credits: [number, number];
  current_stage: Stage;
  result: string;
  status: number;
  game_started: string;
  game_id: string;
  rated_game: boolean;
  side_to_move: ColorN;
  last_clock?: string;
  shop_history?: FenItem[];
  deploy_history?: FenItem[];
  fight_history?: FenItem[];
  fight_move_history?: string[];
  current_fen?: string;
  flipped_board?: boolean;
  blocked_view?: boolean;
  client_stage?: Stage;
  shop_wasm?: ShuuroShop | any;
  deploy_wasm?: ShuuroPosition | any;
  fight_wasm?: any;
  credit?: number;
  piece_counter?: number[];
  am_i_player?: boolean;
  current_index?: number;
  deploy_cground?: Api | any;
  fight_cground?: Api | any;
  player_color?: Color;
  player?: ColorN;
  sfen?: string;
  confirmed_players?: [boolean, boolean];
  boardWasm?: [ShuuroPosition, ShuuroPosition];
  cgs?: [Api, Api];
}

export type Stage = "shop" | "deploy" | "fight";
export type FenItem = [string, number];

export interface ShopItem {
  piece: string;
  price: number;
  toBuy: number;
}

export interface ShopMove {
  sfen: string;
  credit: number;
}

export type Color = "white" | "black";
export type ColorN = 0 | 1;

export const defaultCounter = new Uint8Array([1, 0, 0, 0, 0, 0, 0]);
export const dataMax = new Uint8Array([1, 3, 6, 9, 9, 18, 0]);
export const dataPrice = new Uint8Array([0, 110, 70, 40, 40, 10, 0]);
export const pieces = [
  "k-piece",
  "q-piece",
  "r-piece",
  "b-piece",
  "n-piece",
  "p-piece",
];
