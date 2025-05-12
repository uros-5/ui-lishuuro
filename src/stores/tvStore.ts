import { defineStore } from "pinia";
import { useWs } from "./ws";
import { ref, type Ref } from "vue";
import { NewTvGame, NewTvMove, RedirectToPlacement, RemoveTvGame, TvGames } from "@/helpers/wsTypes";
import { ev2, rmEv2, type Event2 } from "@/helpers/customEvent";
import { MessageType } from "@/helpers/messageType";
import * as v from "valibot"
import { ShuuroPosition } from "shuuro-wasm";
import init from "shuuro-wasm"
import { Variant, variantStr } from "@/helpers/variantDescription";
import { formatSfen } from "@/helpers/fen";
import { Geometry, type BoardDimensions } from "chessground12/types";
import { anonConfig } from "chessground12/configs";
import { fightCg } from "@/helpers/cg";
import type { Api } from "chessground12/api";
import { setCheck } from "chessground12/board";

export const useTvStore = defineStore("tv", () => {
  const ws = useWs();
  const games = ref([] as RedirectToPlacement[]) as Ref<RedirectToPlacement[]>
  let listener
  let s = {
    games,
    onMessage(event: Event2) {
      let detail = event.detail
      let message
      if (detail.t == MessageType.NewPlayer) {
        return
      }
      message = v.safeParse(TvGames, detail);
      if (message.success) {
        games.value = message.output.games
        return
      }

      message = v.safeParse(RemoveTvGame, detail)
      if (message.success) {
        let game = message.output.game
        games.value = games.value.filter((item) =>
          item.id != game
        )
        return
      }
      message = v.safeParse(NewTvGame, detail)
      if (message.success) {
        games.value.push(message.output.game)
        return
      }
      message = v.safeParse(NewTvMove, detail)
      if (message.success) {
        this.addMove(message.output)
        return
      }
    },
    listen() {
      listener = ev2('wsMessage', this.onMessage)
    },
    stopListening() {
      rmEv2(listener!)
      ws.SEND({ t: MessageType.ChangeRoom, d: "" });
    },
    updateCg(id: string, cg?: Api) {
      let game = games.value.find((game) => game.id == id)
      if (game) {
        if (cg) {
          game.cg = cg
        }
        tempPosition(game)
      }
    },
    addMove(move: NewTvMove) {
      let game = games.value.find((game) => game.id == move.game)
      if (game) {
        game.sfen = move.game_move;
        tempPosition(game)
      }
    },
    async init() {
      await init()
    }
  }
  return s
});

export function tvCg(element: HTMLElement, game: RedirectToPlacement) {
  let info = cgInfo(game.variant)
  const cg = fightCg(
    element,
    anonConfig,
    info[0], info[1]
  );
  return cg
}

export function cgInfo(variant: number): [Geometry, BoardDimensions[]] {
  if (variant == Variant.Shuuro || variant == Variant.ShuuroFairy) {
    return [Geometry.dim12x12, [{ width: 12, height: 12 }]]
  }
  else if (variant == Variant.Standard || variant == Variant.StandardFairy) {
    return [Geometry.dim8x8, [{ width: 8, height: 8 }]]
  }
  else if (variant == Variant.ShuuroMini || variant == Variant.ShuuroMiniFairy) {
    return [Geometry.dim6x6, [{ width: 6, height: 6 }]]

  }

  return [Geometry.dim12x12, [{ width: 12, height: 12 }]]
}


function setPieces(cg: Api, sp: ShuuroPosition, force = true) {
  const pieces = sp.map_pieces();
  cg.setPieces(pieces);
  if (force) {
    cg.state.pieces = pieces;
    cg.state.dom.redraw();
  }
}

function setPlinths(cg: Api, sp: ShuuroPosition, ignore?: boolean) {
  if (ignore == true) return;
  const plinths = sp.map_plinths();
  cg.state.plinths = plinths;
  cg.state.plinthsPlaced = false
  cg.setPlinths(plinths);
  cg.redrawAll()
  cg.state.plinthsPlaced = true
}

function setCheck2(cg: Api, sp: ShuuroPosition) {
  let check = sp!.is_check();
  setCheck(cg.state, check);
  cg.state.dom.redraw();
}


export function tempPosition(game: RedirectToPlacement) {
  let sfen = game.sfen
  const position = new ShuuroPosition(variantStr(game.variant));
  position.change_variant(game.variant);
  let formatted = formatSfen(sfen, true);
  position.set_sfen(formatted.sfen);

  let turnColor = position.side_to_move() == "w" ? "white" : "black";
    
  game.cg!.state.turnColor = turnColor;
  setPieces((game.cg as Api), position, true);
  setPlinths((game.cg as Api), position)
  setCheck2((game.cg as Api), position);
  if (formatted.game_move) {
    let isPlacement = formatted.game_move.includes("@")
    const parts = formatted.game_move.split(isPlacement ? "@" : "_");
    const from = parts[0];
    const to = parts[1];
    (game.cg as Api).setLastMove(from, to);
  } else {
    (game.cg as Api).state.lastMove! = [];
  }
}
