import { defineStore } from "pinia";
import init, { ShuuroShop, ShuuroPosition } from "@/plugins/shuuro-wasm";
import { Clock } from "@/plugins/clock";
import Chessground from "@/plugins/chessground12";
import router from "@/router";
import { SEND } from "@/plugins/webSockets";
import { anonConfig, liveConfig, p2 } from "@/plugins/chessground12/configs";
import { readPockets } from "@/plugins/chessground12/pocket";
import { dimensions, Geometry, type Key, type MoveMetadata, type Piece } from "@/plugins/chessground12/types";
import { setCheck } from "@/plugins/chessground12/board";
import type { Config } from "@/plugins/chessground12/config";

import captureUrl from "@/assets/sounds/capture.ogg";
import resUrl from "@/assets/sounds/res.ogg";
import moveUrl from "@/assets/sounds/move.ogg";
import lowTimeUrl from "@/assets/sounds/low_time.ogg";
import { updateHeadTitle } from "@/plugins/updateHeadTitle";
import type { Api } from "@/plugins/chessground12/api";
import type { GameInfo, LiveGameDraw, LiveGameFight, LiveGameResign, PauseConfirmed, RedirectDeploy, SpecCnt } from "@/plugins/webSocketTypes";

const finished = [
  "Checkmate",
  "Draw",
  "RepetitionDraw",
  "MaterialDraw",
  "Stalemate",
];

export const useShuuroStore = defineStore("shuuroStore", {
  state: (): ShuuroStore => {
    return emptyState();
  },
  actions: {
    // SERVER DATA

    // convert server data to store
    fromServer(s: GameInfo, username: string) {
      this.setTime(s);
      this.setStatus(s);
      this.setHistory(s);
      this.setClocks(s);
      this.setPlayer(username);
      this.setBoardData(s, username);
      // redirect
      this.setRedirect();

      const stage = this.current_stage;
      if (stage == 0) {
        this.shopInfo();
      } else if (stage == 1) {
        this.setDeployCg();
        this.setDeployWasm(s.sfen);
      } else if (stage == 2) {
        this.setFightCg();
        this.setFightWasm(s.sfen);
      }
      this.updateCurrentIndex(this.cs());
      this.playLive();
      this.updateHeadTitle();
    },

    // set history for all stages
    setHistory(s: GameInfo) {
      this.history[0] = s.history[0];
      this.history[1] = s.history[1];
      this.history[2] = s.history[2];
    },

    // calculate correct time
    setTime(s: GameInfo) {
      this.game_id = s._id;
      this.min = s.min / 60000;
      this.incr = s.incr / 1000;
      this.side_to_move = s.side_to_move as ColorN;
      this.last_clock = new Date(s.tc.last_click).toString();
    },

    // current status
    setStatus(s: GameInfo) {
      this.current_stage = s.current_stage as StageN;
      this.client_stage = s.current_stage as StageN;
      this.result = s.result;
      this.status = s.status;
      this.variant = s.variant;
      this.subVariant = s.sub_variant;
      //this.ratings = s.ratings;
    },

    // set clocks for both sides
    setClocks(s: GameInfo) {
      this.players = s.players;
      this.clocks = [
        new Clock(s.min / 60000, s.incr / 1000, 0, "1"),
        new Clock(s.min / 60000, s.incr / 1000, 0, "0"),
      ];
      this.credits = [...(s.credits as [number, number])];
      this.clock_ms = [...(s.tc.clocks as [number, number])];
    },

    // check if board is flipped etc
    setBoardData(s: GameInfo, username: string) {
      this.flipped_board = this.player == 1 ? true : false;
      this.credit =
        this.player == 0
          ? this.credits[0]
          : this.credits[1];
      this.player_color = this.getColor(username) as Color;
      this.confirmed_players = [false, false];
      this.sfen = s.sfen;
    },

    // set player(if any)
    setPlayer(username: string) {
      if (username == this.players[0]) {
        this.player = 0;
        this.am_i_player = true;
      } else if (username == this.players[1]) {
        this.player = 1;
        this.am_i_player = true;
      } else {
        this.am_i_player = false;
      }
    },

    // update title for current page
    updateHeadTitle() {
      const players = this.players;
      updateHeadTitle(`${players[0]} vs ${players[1]}`);
    },

    // update client stage based on current stage and redirect player
    setRedirect() {
      const r = router.currentRoute;
      if (this.status > 0) {
        const fullPath = r.value.fullPath;
        if (fullPath.startsWith("/shuuro/0")) {
          this.current_stage = 0;
          this.updateClientStage(0);
        } else if (fullPath.startsWith("/shuuro/1")) {
          this.current_stage = 1;
          this.updateClientStage(1);
        } else if (fullPath.startsWith("/shuuro/2")) {
          this.current_stage = 2;
          this.updateClientStage(2);
        }
      }
      router.push({
        path: `/shuuro/${this.current_stage}/${this.game_id}`,
      });
    },

    // new stage for game
    updateClientStage(stage: StageN): void {
      this.client_stage = stage;
    },

    updateWatchCount(msg: SpecCnt): void {
      if (msg.game_id == this.game_id) {
        this.watchCount = msg.count;
      }
    },

    // SHOP PARTS
    changeVariant(): void {
      const variant = this.getVariant();
      if (variant == "shuuro") {
        this.variant = "shuuro";
        return;
      }
      switch (this.current_stage) {
        case 0:
          (this.wasm0() as ShuuroShop).change_variant(this.variant);
          break;
        case 1:
          this.wasm(1).change_variant(this.variant);
          break;
        case 2:
          this.wasm(2).change_variant(this.variant);
          break;
      }
    },

    // change variant if necessary
    changeTempVariant(pos: ShuuroPosition) {
      const variant = this.getVariant();
      if (variant.endsWith("Fairy")) {
        pos.change_variant(variant);
      }
    },

    // get hand and confirmed_players
    shopInfo(): void {
      this.SEND("live_game_hand")
      this.SEND("live_game_confirmed")
    },

    // get from server confirmed and set
    setConfirmed(data: [boolean, boolean]) {
      this.confirmed_players = data;
      this.activateClock();
    },

    // buying piece
    buy(p: string, color: string) {
      if (this.canShop()) {
        const game_move = `+${p}`;
        this.piece_counter = this.wasm0().buy(game_move);

        this.piece_counter[0] = 1;
        const new_credit = this.wasm0().get_credit(color);
        const counter = this.wasm0().get_piece(p);
        if (new_credit != this.credit) {
          this.clockPause(this.player!, true);
          this.clockStart(this.player!);
          this.history[0]?.push(game_move);
          this.scrollToBottom();
        }
        this.SEND("live_game_buy", game_move)
        this.current_index = this.myHistory(0)?.length! - 1;
        this.credit! = new_credit;
      }
    },

    // confirm shopping list
    confirm(username: string) {
      if (this.canShop()) {
        this.wasm0().confirm(this.player_color!);
        if (this.wasm0().is_confirmed(this.player_color!)) {
          this.SEND("live_game_confirm", "cc")
          this.clockPause(this.player!);
          this.confirmed_players![this.player!] = true;
        }
      }
    },

    // set user hand
    setShuuroHand(hand: string, user: string): void {
      // eslint-disable-next-line
      init().then((_exports) => {
        if (this.current_stage == 0) {
          this.wasm![0] = new ShuuroShop();
          this.changeVariant();

          (this.wasm0() as ShuuroShop).set_hand(hand);
          this.piece_counter = this.wasm0().shop_items(
            this.player_color!
          );
          const h: string[] = this.wasm0().history();
          this.history[0] = h;
          this.credit = (this.wasm0() as ShuuroShop).get_credit(
            this.player_color!
          );
        }
      });
    },

    // DEPLOY PART

    // set deploy chessground
    setDeployCg() {
      const config = this.getConfig();
      this.changePocketRoles(config);
      const elem = document.querySelector("#chessground12") as HTMLElement;
      const top = document.querySelector("#pocket0") as HTMLElement;
      const bot = document.querySelector("#pocket1") as HTMLElement;
      this.cgs![1] = Chessground(elem, config, 800, top, bot);
      this.player! == 1 ? this.cgs(1).toggleOrientation() : null;
      this.changeDimension();
      this.cgs(1).redrawAll();
      this.cgs(1).state.events.dropNewPiece = this.decrementPocket;
    },

    // change pocket roles
    changePocketRoles(config: Config) {
      if (this.getVariant().endsWith("Fairy")) {
        config.pocketRoles = p2;
      }
    },

    // change dimensions
    changeDimension() {
      if (this.variant.startsWith("standard")) {
        this.cgs(this.client_stage!).state.variant = "standard";
        this.cgs(this.client_stage!).state.dimensions = dimensions[1];
        this.cgs(this.client_stage!).state.geometry = Geometry.dim8x8;
      }
    },

    // decrement pocket item number
    decrementPocket(piece: Piece, key: Key) {
      if (!this.canPlay()) {
        return;
      }
      // wasmPlace
      const p = this.shuuroPiece(piece);
      const gameMove = `${p}@${key}`;
      this.sendPlace(gameMove);
      this.wasmPlace(gameMove, false);
      this.setTurnColor();
      this.setCheckDeploy(this.current_stage!);
    },

    // set pocket
    setPocket(hand: string | undefined) {
      if (hand == undefined) {
        return;
      }

      this.cgs(1).state.pockets = readPockets(
        `[${hand}]`,
        this.cgs(1).state.pocketRoles!
      );
      this.cgs(1).redrawAll();
    },

    // send place move to server
    sendPlace(gameMove: string) {
      this.SEND("live_game_place", gameMove);
    },

    // receive move from server and place on board
    serverPlace(msg: any) {
      router.push({ path: `/shuuro/1/${this.game_id}` });
      this.wasmPlace(msg.game_move, true);
      this.setClocks2(msg.clocks);
      if (msg.to_fight) {
        this.current_stage = 2;
        this.client_stage = 2;
        this.last_clock = new Date().toString();
        this.playAudio("res");
        router.push({ path: `/shuuro/2/${this.game_id}` });
      }
      if (msg.first_move_error) {
        const self = this;
        setTimeout(function() {
          self.playAudio("res");
          self.clockPause(self.side_to_move);
          self.result = self.stmS();
          self.status = 1;
        }, 500);
      }
    },

    // set check
    setCheck(check: boolean) {
      const is_check = check;
      setCheck(this.cgs(this.cs()).state, is_check);
    },

    // deploy wasm placing piece
    wasmPlace(game_move: string, isServer: boolean) {
      const placed = this.wasm(1).place(game_move);
      if (placed) {
        this.clockPause(this.side_to_move!);
        const last_move = this.wasm(1).last_move();
        this.history[1].push(last_move);
        this.scrollToBottom();
        this.updateCurrentIndex(1);
        this.updateCgHand();
        this.sfen = this.wasm(1).generate_sfen();
        this.playAudio("move");
        if (isServer) {
          this.setPieces();
          this.setTurnColor();
          this.switchClock();
        }
        this.setCheckDeploy(this.current_stage!);
      }
    },

    // updating cgHand after placing
    updateCgHand() {
      const hand = this.wasm(1).count_hand_pieces();
      this.cgs(1).state.pockets = readPockets(
        `[${hand}]`,
        this.cgs(1).state.pocketRoles!
      );
    },

    // after shop redirect to deploy
    redirectDeploy(s: RedirectDeploy) {
      this.last_clock = s.last_clock;
      this.sfen = s.sfen;
      this.last_clock = new Date().toString();
      router.push({ path: s.path });
      this.side_to_move = s.side_to_move[0] == "w" ? 0 : 1;
      this.clock(this.side_to_move).start();
      this.current_stage = 1;
      this.playAudio("res");
      //this.setShuuroHand(s.hand, "");
    },

    // last item in history
    updateCurrentIndex(stage: StageN) {
      this.current_index = this.myHistory(stage)!.length - 1;
    },

    // set cg data and create new ShuuroPosition
    setDeployWasm(sfen: string) {
      init().then((_exports) => {
        this.wasm![1] = new ShuuroPosition(this.variant);
        this.changeVariant();
        this.wasm(1).set_sfen(sfen);
        const hand = this.wasm(1).count_hand_pieces();
        this.setPocket(hand);
        this.changeDimension();
        this.setPlinths();
        this.setPieces();
        this.activateClock();
        this.cgs(1).state.movable.color = this.player_color;
        this.cgs(1).state.events!.pocketSelect! = this.pocketSelect;
        this.setTurnColor();
        this.setCheckDeploy(this.current_stage!);

        // find plinths pieces and set cg
        // set stm
      });
    },

    // FIGHT PART

    // set fight chessground
    setFightCg() {
      const element = document.querySelector("#chessground12") as HTMLElement;
      const config = this.getConfig();
      this.enablePremove(config);
      this.cgs![2]! = Chessground(element!, config) as Api;
      this.player! == 1 ? this.cgs(2).toggleOrientation() : null;
      this.cgs(2).state.events.select = this.selectSq;
      this.cgs(2).state.movable.events.after = this.movedPiece;
      this.cgs(2).redrawAll();
    },

    // select square
    selectSq(key: Key) {
      if (this.canPlay()) {
      }
    },

    // find legal moves for current player in stage 2
    legal_moves() {
      const moves = this.wasm(2).legal_moves(this.player_color![0] as string);
      this.cgs(2).state.movable.dests = moves;
    },

    // after moving
    movedPiece(orig: Key, dest: Key, _metadata: MoveMetadata) {
      const gameMove = `${orig}_${dest}`;
      this.wasmMove(gameMove, false);
      this.sendMove(gameMove);
      this.playAudio("move");
      if (_metadata.captured!) {
        this.playAudio("capture");
      }
    },

    // move piece from server
    serverMove2(msg: LiveGameFight) {
      router.push({ path: `/shuuro/2/${this.game_id}` });
      this.client_stage = 2;
      this.wasmMove(msg.game_move, true);
      this.setClocks2(msg.clocks);
      if (this.gameOver(msg.outcome)) {
        this.playAudio("res");
        this.clockPause(this.side_to_move, false);
        this.status = msg.status;
        this.result = msg.outcome;
        this.scrollToBottom();
      }
    },

    wasmMove(game_move: string, is_server: boolean) {
      const beforeCount = this.wasm(2).pieces_count();
      const played = this.wasm(2).make_move(game_move);
      if (!played.toLowerCase().startsWith("illegal")) {
        const lastMove = this.wasm(2).last_move();
        const move = game_move.split("_");
        const newCount = this.wasm(2).pieces_count();
        if (is_server) {
          this.cgs(2).move(move[0] as Key, move[1] as Key);
          if (newCount != beforeCount) {
            this.playAudio("capture");
          } else {
            this.playAudio("move");
          }
          if (lastMove.endsWith("*")) {
            this.setPieces();
          }
        }
        if (lastMove.endsWith("*")) {
          this.setPieces();
        }
        this.setTurnColor();
        this.setCheckFight();
        this.switchClock();
        this.history[2].push(lastMove);
        this.scrollToBottom();
        this.updateCurrentIndex(2);
        this.cgs(2).state.dom.redraw();
        this.legal_moves();
        this.playPremove();
      } else {
      }
    },

    // send move to server
    sendMove(s: string) {
      this.SEND("live_game_play", s)
    },

    // set turn color
    setTurnColor() {
      let stm = "white";
      const cs = this.cs();
      stm = this.wasm(cs).side_to_move();
      this.cgs(cs).state.turnColor = stm == "w" ? "white" : "black";
      this.side_to_move = stm == "w" ? 0 : 1;
      this.switchClock();
    },

    // set plinths
    setPlinths() {
      this.changeDimension();
      const cs = this.cs();
      const plinths = this.wasm(cs).map_plinths();
      this.cgs(cs).state.plinths = plinths;
      this.cgs(cs).redrawAll();
    },

    // set pieces
    setPieces() {
      const cs = this.cs();
      const pieces = this.wasm(cs).map_pieces();
      this.cgs(cs).setPieces(pieces);
      this.cgs(cs).state.pieces = pieces;
      this.cgs(cs).state.dom.redraw();
      this.cgs(cs).state.dom.redraw();
    },

    // temp wasm for going back in history
    tempWasm(sfen: string) {
      if (sfen == undefined) {
        return;
      }
      const cs = this.cs();
      const tempWasm = new ShuuroPosition(this.variant);
      this.changeTempVariant(tempWasm);
      tempWasm.set_sfen(sfen);
      const check = tempWasm.is_check();
      const pieces = tempWasm.map_pieces();
      let stm = tempWasm.side_to_move() as Color;
      stm = stm[0] == "w" ? "white" : "black";
      this.cgs(cs).state.turnColor = stm;
      this.cgs(cs).state.pieces = pieces;
      this.setCheck(check);
      this.cgs(cs).state.dom.redraw();
      this.cgs(cs).state.dom.redrawNow();

      if (this.current_index == this.myHistory(cs)!.length - 1) {
        this.cgs(cs).state.movable.showDests = true;
        this.cgs(cs).state.draggable.enabled = true;
        this.cgs(cs).state.movable.color = this.player_color;
        this.setTurnColor();
      } else {
        this.cgs(cs).state.movable.showDests = false;
        this.cgs(cs).state.draggable.enabled = false;
        this.cgs(cs).state.movable.color = "none";
        this.cgs(cs).state.turnColor = "none";
      }

      if (cs == 1) {
        const h = sfen.split(" ")[1];
        tempWasm.set_hand(h);
        const hand = tempWasm.count_hand_pieces();
        this.cgs(1).state.pockets = readPockets(
          `[${hand}]`,
          this.cgs(1).state.pocketRoles!
        );
        this.cgs(1).state.dom.redraw();
      }

      tempWasm.free();
    },

    // set check
    setCheckDeploy(stage: StageN) {
      const is_check = this.wasm(1).is_check();
      setCheck(this.cgs(1).state, is_check);
    },

    // set check in fight
    setCheckFight() {
      const is_check = this.wasm(2).is_check();
      setCheck(this.cgs(2).state, is_check);
    },

    // CLOCKS PART
    pauseConfirmed(data: PauseConfirmed) {
      this.confirmed_players = data.confirmed;
      const confirmed = this.confirmed_players?.findIndex(
        (item) => item == true
      );
      if (confirmed != -1) {
        this.clockPause(confirmed);
      }
    },

    // start both clocks
    startBoth(elapsed: number) {
      this.clock_ms[0] -= elapsed;
      this.clock_ms[1] -= elapsed;
      this.clock(0).start(this.clock_ms[0]);
      this.clock(1).start(this.clock_ms[1]);
    },

    // start game glocks
    startNormal(elapsed: number) {
      this.clock_ms[this.side_to_move] -= elapsed;
      this.clock(this.side_to_move).start(
        this.clock_ms[this.side_to_move]
      );
      const otherClock = this.side_to_move == 0 ? 1 : 0;
      this.clock(otherClock).setTime(this.clock_ms[otherClock]);
      this.clockPause(otherClock);
    },

    // start clocks
    activateClock(): void {
      this.clock(0).onTick(this.clock(0).renderTime);
      this.clock(0).onFlag(this.flagNotif);
      this.clock(0).onHurryCallback(this.lowTimeNotif);
      this.clock(1).onTick(this.clock(1).renderTime);
      this.clock(1).onFlag(this.flagNotif);
      this.clock(1).onHurryCallback(this.lowTimeNotif);
      const elapsed = this.elapsed();
      if (this.status < 0) {
        if (this.current_stage == 0) {
          const confirmed = this.confirmed_players?.findIndex(
            (item) => item == true
          );
          let otherClock;
          if (confirmed != -1) {
            this.clock(confirmed!).setTime(this.clock_ms[confirmed!]);
            this.clockPause(confirmed!);
            this.clock(confirmed!).pause(false);
            otherClock = confirmed == 0 ? 1 : 0;
            this.clock_ms[otherClock] -= elapsed;
            this.clock(otherClock).start(this.clock_ms[otherClock]);
            return;
          }
          this.startBoth(elapsed);
        } else {
          this.startNormal(elapsed);
        }
      }

      // game is finished
      else {
        this.clock(0).setTime(this.clock_ms[0]);
        this.clock(1).setTime(this.clock_ms[1]);
      }
    },

    // flag notification
    flagNotif() { },

    // low time notification
    lowTimeNotif() {
      this.playAudio("low_time");
    },

    // pause one of clocks
    clockPause(id: number, incr = true) {
      this.clock(id).pause(incr);
      this.clock_ms[id] = this.clock(id).duration;
    },

    // start one of clocks
    clockStart(id: number) {
      this.clock(id).start();
    },

    // pause current and start another clock
    switchClock() {
      const otherClock = this.side_to_move == 0 ? 1 : 0;
      this.clock(otherClock).pause(true);
      this.clock(this.side_to_move).start();
      if (this.status > 0) {
        this.clockPause(0, false);
        this.clockPause(1, false);
      }
    },

    // set both clocks from place/move
    setClocks2(clocks: [number, number]) {
      this.clock(0).duration = clocks[0];
      this.clock(1).duration = clocks[1];
    },

    // elapsed time since last clock
    elapsed(): number {
      const now = new Date();
      const converted_date = new Date(this.last_clock!);
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
      let audio;
      switch (sound) {
        case "res":
          audio = resUrl;
          break;
        case "move":
          audio = moveUrl;
          break;
        case "capture":
          audio = captureUrl;
          break;
        case "low_time":
          audio = lowTimeUrl;
          break;
      }
      const a = new Audio(audio);
      a.play();
    },

    // play sound on live only
    playLive() {
      if (this.status <= 0) {
        this.playAudio("res");
      }
    },

    // change cg and create new ShuuroPosition for fight
    setFightWasm(sfen: string) {
      init().then((_exports) => {
        this.wasm![2] = new ShuuroPosition(this.variant);
        this.changeVariant();
        this.wasm(2).set_sfen(sfen);
        this.changeDimension();
        this.setPlinths();
        this.setPieces();
        this.activateClock();
        this.cgs(2).state.movable.color = this.player_color;
        this.setTurnColor();
        this.setCheckFight();
        this.legal_moves();
      });
    },

    pocketSelect(piece: Piece) {
      if (!this.canPlay()) {
        return;
      }

      const ch =
        piece.color == "white"
          ? piece.role[0].toUpperCase()
          : piece.role[0].toLowerCase();
      const moves = this.wasm(1).place_moves(ch);
      this.cgs(1).state.movable!.dests = moves;
    },

    gameDraw(msg: LiveGameDraw, username: string) {
      if (msg.draw) {
        this.playAudio("res");
        this.clockPause(this.side_to_move);
        if (this.current_stage == 0) {
          this.clockPause(0);
          this.clockPause(1);
        }
        this.status = 5;
        this.result = "Draw";
        this.scrollToBottom();
      } else if (msg.player) {
        if (this.am_i_player && msg.player != username) {
          this.offeredDraw = true;
        }
      }
    },

    gameResign(msg: LiveGameResign, username: string) {
      if (msg.resign) {
        this.playAudio("res");
        this.clockPause(0);
        this.clockPause(1);
        this.status = 7;
        this.result = this.getColor(username);
        this.scrollToBottom();
      }
    },

    gameLot(msg: any, username: string) {
      if (msg.status == 8 || msg.status == 5) {
        this.playAudio("res");
        this.clockPause(0, false);
        this.clockPause(1, false);
        this.status = msg.status;
        this.result = msg.result;
        this.scrollToBottom();
      }
    },

    scrollToBottom(): void {
      const container = document.querySelector("#movelist");
      container!.scrollTop = container!.scrollHeight;
    },

    // PREMOVES PART

    enablePremove(config: Config) {
      if (this.am_i_player && this.status < 1) {
        config.premovable = {
          events: { set: (orig, dest) => { }, unset: () => { } },
        };
        config.premovable.enabled = true;
        config.premovable!.events!.set = (orig, dest, metadata) => {
          this.premoveData.orig = orig;
          this.premoveData.dest = dest;
          this.premoveData.active = true;
        };
        config.premovable!.events!.unset! = () => {
          this.premoveData.active = false;
        };
      }
    },

    playPremove() {
      if (this.premoveData.active && this.canPlay()) {
        this.cgs(2).playPremove();
        this.premoveData.active = false;
      }
    },

    // GETTERS
    clock(id: number): Clock {
      return this.clocks[id] as Clock;
    },

    myClock(): Clock {
      return this.clocks[this.player!];
    },

    amIConfirmed(): boolean {
      return this.confirmed_players![this.player!];
    },

    canPlay(): boolean {
      if (
        this.side_to_move == this.player &&
        this.status < 1
      ) {
        return true;
      }
      return false;
    },

    getConfig(): Config {
      const config =
        this.am_i_player && this.status < 1
          ? liveConfig
          : anonConfig;
      return config;
    },

    canConfirm1(): boolean {
      return this.am_i_player! && this.current_stage == 0;
    },

    shuuroPiece(piece: Piece): string {
      const p =
        this.player! == 0
          ? piece.role[0].toUpperCase()
          : piece.role[0].toLowerCase();
      return p;
    },

    gameOver(outcome: string): boolean {
      for (let i = 0; i < finished.length; i++) {
        if (outcome.startsWith(finished[i])) {
          return true;
        }
      }
      return false;
    },

    piece(p: string): string {
      return this.player! == 0 ? p.toUpperCase() : p.toLowerCase();
    },

    getColor(username: string): string {
      const index = this.players.findIndex((item) => item == username)!;
      return index == 0 ? "white" : "black";
    },

    getSfen(): string | undefined {
      if (this.sfen) {
        return this.sfen.split(" ")[2];
      }
      return undefined;
    },

    getVariant(): string {
      return this.variant;
    },

    getSubVariant(): number {
      return this.subVariant;
    },

    dataMax(): Uint8Array {
      const data = new Uint8Array([1, 3, 6, 9, 9, 18, 3, 3, 4]);
      if (this.variant.startsWith("standard")) {
        data[5] = 12;
      }
      if (!this.variant.endsWith("Fairy")) {
        return data.slice(0, 6);
      }
      return data;
    },

    dataPrice(): Uint8Array {
      const data = new Uint8Array([0, 110, 70, 40, 40, 10, 130, 130, 70]);
      if (!this.variant.endsWith("Fairy")) {
        return data.slice(0, 6);
      }
      return data;
    },

    pieces(): string[] {
      const pieces = [
        "k-piece",
        "q-piece",
        "r-piece",
        "b-piece",
        "n-piece",
        "p-piece",
        "c-piece",
        "a-piece",
        "g-piece"
      ];

      if (!this.variant.endsWith("Fairy")) {
        return pieces.slice(0, 6);
      }
      return pieces;
    },

    canShop(): boolean {
      return (
        this.am_i_player! &&
        this.current_stage! == 0 &&
        !this.amIConfirmed()
      );
    },

    currentIndex(): number {
      return this.current_index!;
    },

    myHistory(index: StageN): string[] {
      return this.history![index];
    },

    getHistory(): string[] {
      if (this.client_stage == 0) {
        if (this.am_i_player) {
          let history = this.myHistory(0) as [string];
          let color = this.player_color!;
          let newest: string[] = [];
          history.forEach((value) => {
            let p = value[1];
            if (color == "white") {
              if (p == p.toUpperCase()) {
                newest.push(p);
              }
            } else if (color == "black") {
              if (p == p.toLowerCase()) {
                newest.push(p);
              }
            }
          });
          return newest;
        }
      } else if (this.client_stage == 1) {
        return this.myHistory(1) as string[];
      } else if (this.client_stage == 2) {
        return this.myHistory(2) as string[];
      }
      return [];
    },


    wasm(index: StageN): ShuuroPosition {
      return this.wasm![index] as ShuuroPosition;
    },

    wasm0(): ShuuroShop {
      return this.wasm![0] as ShuuroShop;
    },

    cgs(index: StageN): Api {
      return this.cgs![index] as Api;
    },

    stmS(): string {
      return this.side_to_move == 0 ? "w" : "b";
    },

    stageToN(stage: Stage): StageN {
      switch (stage) {
        case "shop":
          return 0;
        case "deploy":
          return 1;
        case "fight":
          return 2;
      }
    },

    cs(): StageN {
      return this.client_stage!;
    },

    SEND(t: string, game_move?: string) {
      let msg = { game_id: this.game_id, variant: this.variant, t, game_move };
      SEND(msg)
    }
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
    variant: "",
    status: -2,
    game_started: "",
    game_id: "",
    rated_game: false,
    side_to_move: 0,
    watchCount: 0,
    player_color: "white",
    current_fen: "",
    flipped_board: false,
    client_stage: 0,
    am_i_player: false,
    subVariant: 100,
    // SHOP PART
    credit: 800,
    piece_counter: new Uint8Array([1, 0, 0, 0, 0, 0, 0, 0, 0]),
    //DEPLOY PART
    //FIGHT PART
    fight_move_history: [],
    current_index: 0,
    history: [[], [], []],
    wasm: [],
    cgs: [{}, {}, {}],
    offeredDraw: false,
    ratings: undefined,
    premoveData: { active: false, orig: "", dest: "" },
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
  variant: string;
  status: number;
  game_started: string;
  game_id: string;
  rated_game: boolean;
  side_to_move: ColorN;
  watchCount: number;
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
  wasm?: BoardWasm | [];
  cgs?: Cgs | [any, any, any];
  history: [string[], string[], string[]];
  offeredDraw?: boolean;
  ratings: any;
  premoveData: { orig: string; dest: string; active: boolean };
  subVariant: number;
}

export type Stage = "shop" | "deploy" | "fight";
export type StageN = 0 | 1 | 2;
export type FenItem = string;

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

export const defaultCounter = new Uint8Array([1, 0, 0, 0, 0, 0, 0, 0]);
