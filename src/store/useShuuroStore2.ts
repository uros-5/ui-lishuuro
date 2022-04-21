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
import { baseMove, setCheck } from "@/plugins/chessground/board";

let finished = [
  "Checkmate",
  "Draw",
  "RepetitionDraw",
  "MaterialDraw",
  "Stalemate",
];

export const useShuuroStore2 = defineStore("shuuro2", {
  state: (): ShuuroStore => {
    return emptyState();
  },
  actions: {

    // convert server data to store
    fromServer(s: any, username: string) {
      this.setTime(s);
      this.setStatus(s);
      this.setHistory(s);
      this.setClocks(s);
      this.setPlayer(username);
      this.setBoardData(s, username);
      router.push({ path: `/shuuro/${s.current_stage}/${s.game_id}` });
      let stage = this.$state.current_stage;
      if (stage == 0) {
        this.shopInfo();
      } else if (stage == 1) {
        this.setDeployCg();
        this.setDeployWasm(s.sfen);
      } else if (stage == 2) {
        this.setFightCg();
        this.setFightWasm(s.sfen);
      }
      this.playAudio("res");
    },

    setHistory(s: any) {
      this.$state.history![0] = s.shop_history;
      this.$state.history![1] = s.deploy_history;
      this.$state.history![2] = s.fight_history;
    },

    setTime(s: any) {
      this.$state.game_id = s.game_id;
      this.$state.min = s.min;
      this.$state.incr = s.incr;
      this.$state.side_to_move = s.side_to_move[0] == "w" ? 0 : 1;
      this.$state.last_clock = s.last_clock;
    },

    setStatus(s: any) {
      this.$state.current_stage = this.stageToN(s.current_stage);
      this.$state.client_stage = this.stageToN(s.current_stage);
      this.$state.result = s.result;
      this.$state.status = s.status;
    },

    setClocks(s: any) {
      this.$state.players = [s.white, s.black];
      this.$state.clocks = [
        new Clock(s.min / 60000, s.incr / 1000, 0, "1"),
        new Clock(s.min / 60000, s.incr / 1000, 0, "0"),
      ];
      this.$state.credits = [s.white_credit, s.black_credit];
      this.$state.clock_ms = [s.white_clock, s.black_clock];
    },

    setBoardData(s: any, username: string) {
      this.$state.flipped_board = this.$state.player == 1 ? true : false;
      this.$state.credit =
        this.$state.player == 0
          ? this.$state.credits[0]
          : this.$state.credits[1];
      this.$state.player_color = this.getColor(username) as Color;
      this.$state.confirmed_players = [false, false];
      this.$state.sfen = s.sfen;
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
    updateClientStage(stage: StageN): void {
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
        this.$state.piece_counter = this.shopWasm2().buy(p);
        const new_credit = this.shopWasm2().getCredit(color);
        const counter = this.shopWasm2().get_piece(p);
        const game_move = `+${p}`;
        if (new_credit != this.$state.credit) {
          this.history(0)?.push([game_move, counter]);
        }
        SEND({
          t: "live_game_buy",
          game_id: this.$state.game_id,
          game_move: game_move,
        });
        this.$state.current_index = this.history(0)?.length! - 1;
        this.$state.credit! = new_credit;
      }
    },

    // confirm shopping list
    confirm(username: string) {
      if (this.canShop()) {
        this.shopWasm2().confirm(this.$state.player_color!);
        if (this.shopWasm2().isConfirmed(this.$state.player_color!)) {
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
      this.$state.cgs![1] = Chessground(
        elem,
        config,
        800,
        top,
        bot
      );
      this.$state.player! == 1
        ? this.cgs(1).toggleOrientation()
        : null;
      this.cgs(1).redrawAll();
      this.cgs(1).state.events.dropNewPiece = this.decrementPocket;
    },

    // decrement pocket item number
    decrementPocket(piece: Piece, key: Key) {
      // wasmPlace
      let p = this.shuuroPiece(piece);
      this.sendPlace(p, key);
      this.wasmPlace(p, key);
      this.setTurnColor();
      this.setCheckDeploy(this.$state.current_stage!);
    },

    // set pocket
    setPocket(s: string | undefined) {
      if (s == undefined) {
        return;
      }

      this.cgs(1).state.pockets = readPockets(
        `[${s}]`,
        this.cgs(1).state.pocketRoles!
      );
      this.cgs(1).redrawAll();
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
    serverPlace(msg: any) {
      let a = this.deployWasm().server_place(msg.move);
      if (a) {
        let last_move = this.deployWasm().last_move();
        this.setPieces();
        this.setTurnColor();
        this.setCheckDeploy(this.$state.current_stage!);
        this.switchClock();
        this.updateCgHand();
        this.history(1)!.push([last_move, 0]);
        this.$state.sfen = this.deployWasm().generate_sfen();
        this.$state.current_index = this.history(1).length - 1;
      }
      if (msg.to_fight) {
        this.$state.current_stage = 2;
        this.$state.client_stage = 2;
        this.playAudio("res");
        router.push({ path: `/shuuro/fight/${this.$state.game_id}` });
      }
    },

    // set check
    setCheckDeploy(stage: StageN) {
      let is_check = this.deployWasm().is_check();
      setCheck(this.cgs(1).state, is_check);
    },

    setCheckFight() {
      let is_check = this.fightWasm().is_check();
      setCheck(this.cgs(2).state, is_check);
    },

    // deploy_wasm placing piece
    wasmPlace(p: string, key: Key) {
      let placed = this.deployWasm().place(p, key);
      if (placed) {
        let last_move = this.deployWasm().last_move();
        this.history(1)!.push([last_move, 0]);
        this.updateCurrentIndex(1);
        this.updateCgHand();
        this.$state.sfen = this.deployWasm().generate_sfen();
        this.clockPause(this.$state.player!);
        this.playAudio("move");
      }
    },

    // updating cgHand after placing
    updateCgHand() {
      let hand = this.deployWasm().count_hand_pieces();
      this.cgs(1).state.pockets = readPockets(
        `[${hand}]`,
        this.cgs(1).state.pocketRoles!
      );
    },

    // after shop redirect to deploy
    redirectDeploy(s: any) {
      this.$state.last_clock = s.last_clock;
      this.$state.sfen = s.sfen;
      router.push({ path: s.path });
      this.$state.side_to_move = s.side_to_move[0] == "w" ? 0 : 1;
      this.clock(this.$state.side_to_move).start();
      this.$state.current_stage = 1;
      this.playAudio("res");
      //this.setShuuroHand(s.hand, "");
    },

    // last item in history
    updateCurrentIndex(stage: StageN) {
      this.$state.current_index = this.history(stage)!.length - 1;
    },

    setDeployWasm(sfen: string) {
      init().then((_exports) => {
        this.$state.boardWasm![1] = new ShuuroPosition();
        this.deployWasm().set_sfen(sfen);
        let hand = this.deployWasm().count_hand_pieces();
        this.setPocket(hand);
        this.setPlinths();
        this.setPieces();
        this.activateClock();
        this.cgs(1).state.movable.color = this.$state.player_color;
        this.cgs(1).state.events!.pocketSelect! = this.pocketSelect;
        this.setTurnColor();
        this.setCheckDeploy(this.$state.current_stage!);

        // find plinths pieces and set cg
        // set stm
      });
    },

    // FIGHT PART

    // set fight chessground
    setFightCg() {
      const element = document.querySelector(".chessground12") as HTMLElement;
      const config = this.$state.am_i_player ? liveFightConfig : anonConfig;
      this.$state.cgs![2]! = Chessground(element!, config) as Api;
      this.$state.player! == 1 ? this.cgs(2).toggleOrientation() : null;
      this.cgs(2).state.events.select = this.selectSq;
      this.cgs(2).state.movable.events.after = this.movedPiece;
      this.cgs(2).redrawAll();
    },

    // select square
    selectSq(key: Key) {
      if (this.canPlay()) {
        let moves = this.fightWasm().legal_moves(key);
        let map = new Map();
        map.set(key, moves);
        this.cgs(2).state.movable.dests = map;
      }
    },

    // after moving
    movedPiece(orig: Key, dest: Key, _metadata: MoveMetadata) {
      let played = this.fightWasm().play(orig, dest);
      this.updateCurrentIndex(2);
      this.sendMove(`${orig}_${dest}`);
      this.playAudio("move");
      if (_metadata.captured!) {
        this.playAudio("capture");
      }
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
      if (this.$state.client_stage == 1) {
        stm = this.deployWasm().side_to_move();
        this.cgs(1).state.turnColor = stm == "w" ? "white" : "black";
      } else if (this.$state.client_stage == 2) {
        stm = this.fightWasm().side_to_move();
        this.cgs(2).state.turnColor = stm == "w" ? "white" : "black";
      }
      this.$state.side_to_move = stm == "w" ? 0 : 1;
      this.switchClock();
    },

    // set plinths
    setPlinths() {
      if (this.$state.client_stage == 1) {
        let plinths = this.deployWasm().map_plinths();
        this.cgs(1).state.plinths = plinths;
        this.cgs(1).redrawAll();
      } else if (this.$state.client_stage == 2) {
        let plinths = this.fightWasm().map_plinths();
        this.cgs(2).state.plinths = plinths;
        this.cgs(2).redrawAll();
      }
    },

    // set pieces
    setPieces() {
      if (this.$state.client_stage == 1) {
        let pieces = this.deployWasm().map_pieces();
        this.cgs(1).setPieces(pieces);
        this.cgs(1).state.dom.redraw();
      } else if (this.$state.client_stage == 2) {
        let pieces = this.fightWasm().map_pieces();
        this.cgs(2).state.pieces = pieces;
        this.cgs(2).state.dom.redraw();
      }
    },

    serverMove2(msg: any) {
      let beforeCount = this.fightWasm().pieces_count();
      let m = this.fightWasm().server_move(msg.game_move);
      let move = msg.game_move.split("_");
      let lastMove = this.fightWasm().last_move();
      let newCount = this.fightWasm().pieces_count();
      this.cgs(2).move(move[0], move[1]);
      this.setTurnColor();
      this.setCheckFight();
      this.switchClock();
      this.history(2)!.push([lastMove, 0]);
      this.$state.sfen = this.fightWasm().generate_sfen();
      if (newCount > beforeCount) {
        this.playAudio("capture");
      }
      this.updateCurrentIndex(2);
      this.cgs(2).state.dom.redraw();
      if (this.gameOver(msg.outcome)) {
        this.playAudio("res");
        this.clockPause(this.$state.side_to_move);
      }
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
        if (this.$state.current_stage == 0) {
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

    // start one of clocks
    clockStart(id: number) {
      this.clock(id).start();
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

    // start audio
    playAudio(sound: string) {
      let a = new Audio(`../../src/assets/sounds/${sound}.ogg`);
      a.play();
    },

    dropPiece() { },

    setFightWasm(sfen: string) {
      init().then((_exports) => {
        this.$state.boardWasm![2] = new ShuuroPosition();
        this.fightWasm().set_sfen(sfen);
        this.setPlinths();
        this.setPieces();
        this.activateClock();
        this.cgs(2).state.movable.color = this.$state.player_color;
        this.setTurnColor();
      });
    },

    // set user hand
    setShuuroHand(hand: string, user: string): void {
      // eslint-disable-next-line
      init().then((_exports) => {
        if (this.$state.current_stage == 0) {
          this.$state.boardWasm![0] = new ShuuroShop();
          (this.shopWasm2() as ShuuroShop).set_hand(hand);
          this.$state.piece_counter = this.shopWasm2().shop_items(
            this.$state.player_color!
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
      this.cgs(1).state.movable!.dests = moves;
    },

    // is game over

    gameOver(outcome: string): boolean {
      for (let i = 0; i < finished.length; i++) {
        if (outcome.startsWith(finished[i])) {
          return true;
        }
      }
      return false;
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

    canPlay(): boolean {
      if (this.$state.side_to_move == this.$state.player) {
        return true;
      }
      return false;
    },

    canConfirm1(): boolean {
      return this.$state.am_i_player! && this.$state.current_stage == 0;
    },

    shuuroPiece(piece: Piece): string {
      let p =
        this.$state.player! == 0
          ? piece.role[0].toUpperCase()
          : piece.role[0].toLowerCase();
      return p;
    },

    tempDeployWasm(sfen: string) {
      let temp = new ShuuroPosition();
      temp.set_sfen(sfen);
      let pieces = temp.map_pieces();
      let hand = temp.count_hand_pieces();
      this.cgs(1).state.pieces = pieces;
      this.cgs(1).state.dom.redraw();
      this.cgs(1).state.pockets = readPockets(
        `[${hand}]`,
        this.cgs(1).state.pocketRoles!
      );
      this.cgs(1).state.dom.redrawNow();

      if (this.$state.current_index == this.history(1)!.length - 1) {
        this.cgs(1).state.movable.showDests = true;
        this.cgs(1).state.draggable.enabled = true;
        this.cgs(1).state.movable.color = this.$state.player_color;
      } else {
        this.cgs(1).state.movable.showDests = false;
        this.cgs(1).state.draggable.enabled = false;
        this.cgs(1).state.movable.color = "none";
      }

      temp.free();
    },

    tempFightWasm(sfen: string) {
      let temp = new ShuuroPosition();
      temp.set_sfen(sfen);
      let pieces = temp.map_pieces();
      this.cgs(2).state.pieces = pieces;
      this.cgs(2).state.dom.redraw();
      this.cgs(2).state.dom.redrawNow();

      if (this.$state.current_index == this.history(2)!.length - 1) {
        this.cgs(2).state.movable.showDests = true;
        this.cgs(2).state.draggable.enabled = true;
        this.cgs(2).state.movable.color = this.$state.player_color;
      } else {
        this.cgs(2).state.movable.showDests = false;
        this.cgs(2).state.draggable.enabled = false;
        this.cgs(2).state.movable.color = "none";
      }

      temp.free();
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
      return this.history(this.client_stage!);
    },

    shopWasm(): ShuuroShop {
      return this.shopWasm2() as ShuuroShop;
    },

    deployWasm(): ShuuroPosition {
      return this.$state.boardWasm![1] as ShuuroPosition;
    },

    fightWasm(): ShuuroPosition {
      return this.$state.boardWasm![2] as ShuuroPosition;
    },

    canShop(): boolean {
      return (
        this.$state.am_i_player! &&
        this.$state.current_stage! == 0 &&
        !this.amIConfirmed()
      );
    },

    currentIndex(): number {
      return this.$state.current_index!;
    },

    history(index: StageN): FenItem[] {
      return this.$state.history![index];
    },

    boardWasm(index: StageN): ShuuroPosition {
      return this.$state.boardWasm![index] as ShuuroPosition;
    },

    shopWasm2(): ShuuroShop {
      return this.$state.boardWasm![0] as ShuuroShop;
    },

    cgs(index: StageN): Api {
      return this.$state.cgs![index] as Api;
    },

    stageToN(stage: Stage): StageN {
      switch (stage) {
        case "shop": return 0;
        case "deploy": return 1;
        case "fight": return 2;
      }
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
    current_stage: 0,
    result: "",
    status: -2,
    game_started: "",
    game_id: "",
    rated_game: false,
    side_to_move: 0,
    player_color: "white",
    current_fen: "",
    flipped_board: false,
    client_stage: 0,
    am_i_player: false,
    // SHOP PART
    credit: 800,
    piece_counter: new Uint8Array([1, 0, 0, 0, 0, 0, 0]),
    //DEPLOY PART
    //FIGHT PART
    fight_move_history: [],
    current_index: 0,
    history: [[], [], []],
    boardWasm: [],
    cgs: [{}, {}, {}]
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
  current_stage: StageN;
  result: string;
  status: number;
  game_started: string;
  game_id: string;
  rated_game: boolean;
  side_to_move: ColorN;
  last_clock?: string;
  fight_move_history?: string[];
  current_fen?: string;
  flipped_board?: boolean;
  blocked_view?: boolean;
  client_stage?: StageN;
  credit?: number;
  piece_counter?: Uint8Array;
  am_i_player?: boolean;
  current_index?: number;
  player_color?: Color;
  player?: ColorN;
  sfen?: string;
  confirmed_players?: [boolean, boolean];
  boardWasm?: BoardWasm | [];
  cgs?: Cgs | [any, any, any];
  history?: [FenItem[], FenItem[], FenItem[]];
}

export type Stage = "shop" | "deploy" | "fight";
export type StageN = 0 | 1 | 2;
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

export type BoardWasm = [ShuuroShop, ShuuroPosition, ShuuroPosition];
export type Cgs = [Api, Api, Api];

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
