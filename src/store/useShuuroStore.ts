import { defineStore } from "pinia";
import init, { ShuuroShop, ShuuroPosition } from "shuuro-wasm";
import { Clock } from "@/plugins/clock";
import { Chessground } from "chessground12";
import router from "@/router";
import { ServerDate } from "@/plugins/serverDate";
import { SEND } from "@/plugins/webSockets";
import { anonConfig, liveConfig, p2 } from "chessground12/configs";
import { Api } from "chessground12/api";
import { readPockets } from "chessground12/pocket";
import { Key, MoveMetadata, Piece } from "chessground12/types";
import { setCheck } from "chessground12/board";
import { Config } from "chessground12/config";

import captureUrl from "@/assets/sounds/capture.ogg";
import resUrl from "@/assets/sounds/res.ogg";
import moveUrl from "@/assets/sounds/move.ogg";
import lowTimeUrl from "@/assets/sounds/low_time.ogg";
import { updateHeadTitle } from "@/plugins/updateHeadTitle";

let finished = [
  "Checkmate",
  "Draw",
  "RepetitionDraw",
  "MaterialDraw",
  "Stalemate",
];

export const useShuuroStore = defineStore("shuuro2", {
  state: (): ShuuroStore => {
    return emptyState();
  },
  actions: {
    // SERVER DATA

    // convert server data to store
    fromServer(s: any, username: string) {
      this.setTime(s);
      this.setStatus(s);
      this.setHistory(s);
      this.setClocks(s);
      this.setPlayer(username);
      this.setBoardData(s, username);
      // redirect
      this.setRedirect();

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
      this.updateCurrentIndex(this.cs());
      this.playLive();
      this.updateHeadTitle();
    },

    // set history for all stages
    setHistory(s: any) {
      this.$state.history![0] = s.history[0];
      this.$state.history![1] = s.history[1];
      this.$state.history![2] = s.history[2];
    },

    // calculate correct time
    setTime(s: any) {
      this.$state.game_id = s.game_id;
      this.$state.min = s.min / 60000;
      this.$state.incr = s.incr / 1000;
      this.$state.side_to_move = s.side_to_move;
      this.$state.last_clock = new Date(s.tc.last_click).toString();
    },

    // current status
    setStatus(s: any) {
      this.$state.current_stage = s.current_stage;
      this.$state.client_stage = s.current_stage;
      this.$state.result = s.result;
      this.$state.status = s.status;
      this.$state.variant = s.variant;
      //this.$state.ratings = s.ratings;
    },

    // set clocks for both sides
    setClocks(s: any) {
      this.$state.players = s.players;
      this.$state.clocks = [
        new Clock(s.min / 60000, s.incr / 1000, 0, "1"),
        new Clock(s.min / 60000, s.incr / 1000, 0, "0"),
      ];
      this.$state.credits = [...(s.credits as [number, number])];
      this.$state.clock_ms = [...(s.tc.clocks as [number, number])];
    },

    // check if board is flipped etc
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

    // update title for current page
    updateHeadTitle() {
      let players = this.$state.players;
      updateHeadTitle(`${players[0]} vs ${players[1]}`);
    },

    // update client stage based on current stage and redirect player
    setRedirect() {
      let r = router.currentRoute;
      if (this.$state.status > 0) {
        let fullPath = r.value.fullPath;
        if (fullPath.startsWith("/shuuro/0")) {
          this.$state.current_stage = 0;
          this.updateClientStage(0);
        } else if (fullPath.startsWith("/shuuro/1")) {
          this.$state.current_stage = 1;
          this.updateClientStage(1);
        } else if (fullPath.startsWith("/shuuro/2")) {
          this.$state.current_stage = 2;
          this.updateClientStage(2);
        }
      }
      router.push({
        path: `/shuuro/${this.$state.current_stage}/${this.$state.game_id}`,
      });
    },

    // new stage for game
    updateClientStage(stage: StageN): void {
      this.$state.client_stage = stage;
    },

    updateWatchCount(msg: any): void {
      if (msg.game_id == this.$state.game_id) {
        this.$state.watchCount = msg.count;
      }
    },

    // SHOP PARTS
    changeVariant(): void {
      let variant = this.getVariant();
      if (variant == "shuuro12") {
        this.$state.variant = "shuuro12";
        return;
      }
      switch (this.$state.current_stage) {
        case 0:
          (this.wasm0() as ShuuroShop).change_variant(variant);
          break;
        case 1:
          this.wasm(1).change_variant();
          break;
        case 2:
          this.wasm(2).change_variant();
          break;
      }
    },

    // change variant if necessary
    changeTempVariant(pos: ShuuroPosition) {
      let variant = this.getVariant();
      if (variant != "shuuro12") {
        pos.change_variant();
      }
    },

    // get hand and confirmed_players
    shopInfo(): void {
      SEND({
        t: "live_game_hand",
        //color: this.$state.player_color,
        game_id: this.$state.game_id,
      });
      SEND({
        t: "live_game_confirmed",
        //color: this.$state.player_color,
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
        const game_move = `+${p}`;
        this.$state.piece_counter = this.wasm0().buy(game_move);
        this.$state.piece_counter[0] = 1;
        const new_credit = this.wasm0().get_credit(color);
        const counter = this.wasm0().get_piece(p);
        if (new_credit != this.$state.credit) {
          this.clockPause(this.$state.player!, true);
          this.clockStart(this.$state.player!);
          this.history(0)?.push([game_move, counter]);
          this.scrollToBottom();
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
        this.wasm0().confirm(this.$state.player_color!);
        if (this.wasm0().is_confirmed(this.$state.player_color!)) {
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

    // set user hand
    setShuuroHand(hand: string, user: string): void {
      // eslint-disable-next-line
      init().then((_exports) => {
        if (this.$state.current_stage == 0) {
          this.$state.wasm![0] = new ShuuroShop();
          this.changeVariant();
          (this.wasm0() as ShuuroShop).set_hand(hand);
          this.$state.piece_counter = this.wasm0().shop_items(
            this.$state.player_color!
          );
          let h = this.wasm0().history();
          this.$state.history![0] = h;
          this.$state.credit = (this.wasm0() as ShuuroShop).get_credit(
            this.$state.player_color!
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
      this.$state.cgs![1] = Chessground(elem, config, 800, top, bot);
      this.$state.player! == 1 ? this.cgs(1).toggleOrientation() : null;
      this.cgs(1).redrawAll();
      this.cgs(1).state.events.dropNewPiece = this.decrementPocket;
    },

    // change pocket roles
    changePocketRoles(config: Config) {
      if (this.getVariant() != "shuuro12") {
        config.pocketRoles = p2;
      }
    },

    // decrement pocket item number
    decrementPocket(piece: Piece, key: Key) {
      if (!this.canPlay()) {
        return;
      }
      // wasmPlace
      let p = this.shuuroPiece(piece);
      let gameMove = `${p}@${key}`;
      this.sendPlace(gameMove);
      this.wasmPlace(gameMove, false);
      this.setTurnColor();
      this.setCheckDeploy(this.$state.current_stage!);
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
      SEND({
        t: "live_game_place",
        game_id: this.$state.game_id,
        game_move: gameMove,
      });
    },

    // receive move from server and place on board
    serverPlace(msg: any) {
      router.push({ path: `/shuuro/1/${this.$state.game_id}` });
      this.wasmPlace(msg.move, true);
      this.setClocks2(msg.clocks);
      if (msg.to_fight) {
        this.$state.current_stage = 2;
        this.$state.client_stage = 2;
        this.$state.last_clock = new Date().toString();
        this.playAudio("res");
        router.push({ path: `/shuuro/2/${this.$state.game_id}` });
      }
      if (msg.first_move_error) {
        let self = this;
        setTimeout(function () {
          self.playAudio("res");
          self.clockPause(self.$state.side_to_move);
          self.$state.result = self.stmS();
          self.$state.status = 1;
        }, 500);
      }
    },

    // set check
    setCheck(check: boolean) {
      let is_check = check;
      setCheck(this.cgs(this.cs()).state, is_check);
    },

    // deploy wasm placing piece
    wasmPlace(game_move: string, isServer: boolean) {
      let placed = this.wasm(1).place(game_move);
      if (placed) {
        this.clockPause(this.$state.side_to_move!);
        let last_move = this.wasm(1).last_move();
        this.history(1)!.push([last_move, 0]);
        this.scrollToBottom();
        this.updateCurrentIndex(1);
        this.updateCgHand();
        this.$state.sfen = this.wasm(1).generate_sfen();
        this.playAudio("move");
        if (isServer) {
          this.setPieces();
          this.setTurnColor();
          this.switchClock();
        }
        this.setCheckDeploy(this.$state.current_stage!);
      }
    },

    // updating cgHand after placing
    updateCgHand() {
      let hand = this.wasm(1).count_hand_pieces();
      this.cgs(1).state.pockets = readPockets(
        `[${hand}]`,
        this.cgs(1).state.pocketRoles!
      );
    },

    // after shop redirect to deploy
    redirectDeploy(s: any) {
      this.$state.last_clock = s.last_clock;
      this.$state.sfen = s.sfen;
      this.$state.last_clock = new Date().toString();
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

    // set cg data and create new ShuuroPosition
    setDeployWasm(sfen: string) {
      init().then((_exports) => {
        this.$state.wasm![1] = new ShuuroPosition();
        this.changeVariant();
        this.wasm(1).set_sfen(sfen);
        let hand = this.wasm(1).count_hand_pieces();
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
      const element = document.querySelector("#chessground12") as HTMLElement;
      const config = this.getConfig();
      console.log(config);
      this.enablePremove(config);
      this.$state.cgs![2]! = Chessground(element!, config) as Api;
      this.$state.player! == 1 ? this.cgs(2).toggleOrientation() : null;
      this.cgs(2).state.events.select = this.selectSq;
      this.cgs(2).state.movable.events.after = this.movedPiece;
      this.cgs(2).redrawAll();
    },

    // select square
    selectSq(key: Key) {
      if (this.canPlay()) {
        let moves = this.wasm(2).legal_moves(key);
        let map = new Map();
        map.set(key, moves);
        this.cgs(2).state.movable.dests = map;
      }
    },

    // after moving
    movedPiece(orig: Key, dest: Key, _metadata: MoveMetadata) {
      let gameMove = `${orig}_${dest}`;
      this.wasmMove(gameMove, false);
      this.sendMove(gameMove);
      this.playAudio("move");
      if (_metadata.captured!) {
        this.playAudio("capture");
      }
    },

    // move piece from server
    serverMove2(msg: any) {
      router.push({ path: `/shuuro/2/${this.$state.game_id}` });
      this.$state.client_stage = 2;
      this.wasmMove(msg.game_move, true);
      this.setClocks2(msg.clocks);
      if (this.gameOver(msg.outcome)) {
        this.playAudio("res");
        this.clockPause(this.$state.side_to_move, false);
        this.$state.status = msg.status;
        this.$state.result = msg.outcome;
        this.scrollToBottom();
      }
    },

    wasmMove(game_move: string, is_server: boolean) {
      let beforeCount = this.wasm(2).pieces_count();
      let played = this.wasm(2).make_move(game_move);
      if (!played.toLowerCase().startsWith("illegal")) {
        let lastMove = this.wasm(2).last_move();
        let move = game_move.split("_");
        let newCount = this.wasm(2).pieces_count();
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
        this.history(2)!.push([lastMove, 0]);
        this.scrollToBottom();
        this.updateCurrentIndex(2);
        this.cgs(2).state.dom.redraw();
        this.playPremove();
      } else {
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
      let cs = this.cs();
      stm = this.wasm(cs).side_to_move();
      this.cgs(cs).state.turnColor = stm == "w" ? "white" : "black";
      this.$state.side_to_move = stm == "w" ? 0 : 1;
      this.switchClock();
    },

    // set plinths
    setPlinths() {
      let cs = this.cs();
      let plinths = this.wasm(cs).map_plinths();
      this.cgs(cs).state.plinths = plinths;
      this.cgs(cs).redrawAll();
    },

    // set pieces
    setPieces() {
      let cs = this.cs();
      let pieces = this.wasm(cs).map_pieces();
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
      let cs = this.cs();
      let temp = new ShuuroPosition();
      this.changeTempVariant(temp);
      temp.set_sfen(sfen);
      let check = temp.is_check();
      let pieces = temp.map_pieces();
      let stm = temp.side_to_move() as Color;
      stm = stm[0] == "w" ? "white" : "black";
      this.cgs(cs).state.turnColor = stm;
      this.cgs(cs).state.pieces = pieces;
      this.setCheck(check);
      this.cgs(cs).state.dom.redraw();
      this.cgs(cs).state.dom.redrawNow();

      if (this.$state.current_index == this.history(cs)!.length - 1) {
        this.cgs(cs).state.movable.showDests = true;
        this.cgs(cs).state.draggable.enabled = true;
        this.cgs(cs).state.movable.color = this.$state.player_color;
        this.setTurnColor();
      } else {
        this.cgs(cs).state.movable.showDests = false;
        this.cgs(cs).state.draggable.enabled = false;
        this.cgs(cs).state.movable.color = "none";
        this.cgs(cs).state.turnColor = "none";
      }

      if (cs == 1) {
        let h = sfen.split(" ")[1];
        temp.set_hand(h);
        let hand = temp.count_hand_pieces();
        this.cgs(1).state.pockets = readPockets(
          `[${hand}]`,
          this.cgs(1).state.pocketRoles!
        );
        this.cgs(1).state.dom.redraw();
      }

      temp.free();
    },

    // set check
    setCheckDeploy(stage: StageN) {
      let is_check = this.wasm(1).is_check();
      setCheck(this.cgs(1).state, is_check);
    },

    // set check in fight
    setCheckFight() {
      let is_check = this.wasm(2).is_check();
      setCheck(this.cgs(2).state, is_check);
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
      this.clock(0).onFlag(this.flagNotif);
      this.clock(0).onHurryCallback(this.lowTimeNotif);
      this.clock(1).onTick(this.clock(1).renderTime);
      this.clock(1).onFlag(this.flagNotif);
      this.clock(1).onHurryCallback(this.lowTimeNotif);
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

      // game is finished
      else {
        this.clock(0).setTime(this.$state.clock_ms[0]);
        this.clock(1).setTime(this.$state.clock_ms[1]);
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
      this.$state.clock_ms[id] = this.clock(id).duration;
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
      if (this.$state.status > 0) {
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
      const converted_date = new Date(this.$state.last_clock!);
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
      let a = new Audio(audio);
      a.play();
    },

    // play sound on live only
    playLive() {
      if (this.$state.status <= 0) {
        this.playAudio("res");
      }
    },

    // change cg and create new ShuuroPosition for fight
    setFightWasm(sfen: string) {
      init().then((_exports) => {
        this.$state.wasm![2] = new ShuuroPosition();
        this.changeVariant();
        this.wasm(2).set_sfen(sfen);
        this.setPlinths();
        this.setPieces();
        this.activateClock();
        this.cgs(2).state.movable.color = this.$state.player_color;
        this.setTurnColor();
        this.setCheckFight();
      });
    },

    pocketSelect(piece: Piece) {
      if (!this.canPlay()) {
        return;
      }

      let ch =
        piece.color == "white"
          ? piece.role[0].toUpperCase()
          : piece.role[0].toLowerCase();
      let moves = this.wasm(1).place_moves(ch);
      this.cgs(1).state.movable!.dests = moves;
    },

    gameDraw(msg: any, username: string) {
      if (msg.draw) {
        this.playAudio("res");
        this.clockPause(this.$state.side_to_move);
        if (this.$state.current_stage == 0) {
          this.clockPause(0);
          this.clockPause(1);
        }
        this.$state.status = 5;
        this.$state.result = "Draw";
        this.scrollToBottom();
      } else if (msg.player) {
        if (this.$state.am_i_player && msg.player != username) {
          this.$state.offeredDraw = true;
        }
      }
    },

    gameResign(msg: any, username: string) {
      if (msg.resign) {
        this.playAudio("res");
        this.clockPause(0);
        this.clockPause(1);
        this.$state.status = 7;
        this.$state.result = this.getColor(username);
        this.scrollToBottom();
      }
    },

    gameLot(msg: any, username: string) {
      if (msg.status == 8 || msg.status == 5) {
        this.playAudio("res");
        this.clockPause(0, false);
        this.clockPause(1, false);
        this.$state.status = msg.status;
        this.$state.result = msg.result;
        this.scrollToBottom();
      }
    },

    scrollToBottom(): void {
      const container = document.querySelector("#movelist");
      container!.scrollTop = container!.scrollHeight;
    },

    // PREMOVES PART

    enablePremove(config: Config) {
      if (this.$state.am_i_player && this.$state.status < 1) {
        config.premovable = { events: { set: (orig, dest) => { }, unset: () => { } } }
        config.premovable.enabled = true;
        config.premovable!.events!.set = (orig, dest, metadata) => {
          this.$state.premoveData.orig = orig;
          this.$state.premoveData.dest = dest;
          this.$state.premoveData.active = true;
        };
        config.premovable!.events!.unset! = () => {
          this.$state.premoveData.active = false;
        };
      }
    },

    playPremove() {
      if (this.$state.premoveData.active && this.canPlay()) {
        let moves = this.wasm(2).legal_moves(this.$state.premoveData.orig);
        let map = new Map();
        map.set(this.$state.premoveData.orig, moves);
        this.cgs(2).state.movable.dests = map;
        this.cgs(2).playPremove();
        this.$state.premoveData.active = false;
      }
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
      if (
        this.$state.side_to_move == this.$state.player &&
        this.$state.status < 1
      ) {
        return true;
      }
      return false;
    },

    getConfig(): Config {
      const config =
        this.$state.am_i_player && this.$state.status < 1
          ? liveConfig
          : anonConfig;
      return config;
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

    gameOver(outcome: string): boolean {
      for (let i = 0; i < finished.length; i++) {
        if (outcome.startsWith(finished[i])) {
          return true;
        }
      }
      return false;
    },

    piece(p: string): string {
      return this.$state.player! == 0 ? p.toUpperCase() : p.toLowerCase();
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

    getVariant(): string {
      return this.$state.variant;
    },

    dataMax(): Uint8Array {
      const data = new Uint8Array([1, 3, 6, 9, 9, 18, 3, 3]);
      if (this.$state.variant == "shuuro12") {
        return data.slice(0, 6);
      }
      return data;
    },

    dataPrice(): Uint8Array {
      const data = new Uint8Array([0, 110, 70, 40, 40, 10, 130, 130]);
      if (this.$state.variant == "shuuro12") {
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
      ];
      if (this.$state.variant == "shuuro12") {
        return pieces.slice(0, 6);
      }
      return pieces;
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

    wasm(index: StageN): ShuuroPosition {
      return this.$state.wasm![index] as ShuuroPosition;
    },

    wasm0(): ShuuroShop {
      return this.$state.wasm![0] as ShuuroShop;
    },

    cgs(index: StageN): Api {
      return this.$state.cgs![index] as Api;
    },

    stmS(): string {
      return this.$state.side_to_move == 0 ? "w" : "b";
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
      return this.$state.client_stage!;
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
  history?: [FenItem[], FenItem[], FenItem[]];
  offeredDraw?: boolean;
  ratings: any;
  premoveData: { orig: string; dest: string; active: boolean };
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
