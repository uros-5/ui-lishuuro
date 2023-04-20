import { useWasmStore } from "@/store/game/useWasmStore"
import { ref } from "vue";
import { useGameStore } from ".";
import { useClockStore } from "./useClockStore";

export const useShopStore = () => {
  const state = ref(empty());
  const wasm = useWasmStore();
  const game = useGameStore();
  const clock = useClockStore();

  return new class {
    shopInfo(): void {
      game.send("live_game_hand");
      game.send("live_game_confirmed");
    }

    setConfirmed(data: [boolean, boolean]) {
      state.value.confirmed = data;
      this.startClock();
    }

    setHand(hand: string) {
      wasm.shop().set_hand(hand);
      state.value.pieceCounter = wasm.shop().shop_items(game.playerColor);
      const moves: string[] = wasm.shop().history();
      game.addMoves(0, moves);
      state.value.credit = wasm.shop().get_credit(
        game.playerColor
      );
    }


    buy(p: string, color: string) {
      if (this.canShop) {
        const game_move = `+${p}`;
        state.value.pieceCounter = wasm.shop().buy(game_move);

        state.value.pieceCounter[0] = 1;
        const new_credit = wasm.shop().get_credit(color);
        const _ = wasm.shop().get_piece(p);
        if (new_credit != state.value.credit) {
          game.addMove(0, game_move);
          game.scrollToBottom();
        }
        game.send("live_game_buy", game_move);
        game.index().value = game.state.history[0].length - 1;
        state.value.credit = new_credit;
      }
    }


    confirm() {
      if (this.canShop) {
        wasm.shop().confirm(game.playerColor);
        if (wasm.shop().is_confirmed(game.playerColor)) {
          game.send("live_game_confirm", "cc");
          clock.pause(game.player.player);
          state.value.confirmed[game.player.player] = true;
        }
      }
    }

    private startClock() {
      const elapsed = clock.elapsed;
      const confirmed = state.value.confirmed.findIndex(
        (item) => item == true
      );
      if (confirmed != -1) {
        clock.setTime(confirmed, game.state.tc.clocks[confirmed]-elapsed);
        clock.pause(confirmed, false);
        const other = clock.otherClock(confirmed);
        clock.start(other)
        return ;
      }
      clock.startBoth(elapsed, game.state.tc.clocks)
    }


    get amIConfirmed(): boolean {
      return state.value.confirmed[game.player.player];
    }

    get canPlay(): boolean {
      if (game.state.side_to_move == game.player.player && game.state.status < 1) {
        return true;
      }
      return false;
    }

    get canShop(): boolean {
      return (
        game.player.isPlayer! &&
        game.state.current_stage! == 0 &&
        game.state.status < 0 &&
        !this.amIConfirmed
      );
    }

    get pieceCounter() {
      return state.value.pieceCounter
    }

    get credit() {
      return state.value.credit;
    }
  }

};

function empty(): State {
  return {
    confirmed: [false, false],
    pieceCounter: new Uint8Array(),
    credit: 800
  }
}

type State = {
  confirmed: [boolean, boolean],
  pieceCounter: Uint8Array,
  credit: number
}
