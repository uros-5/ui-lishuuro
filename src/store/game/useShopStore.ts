import { useWasmStore } from "@/store/game/useWasmStore";
import { ref } from "vue";
import { useGameStore } from ".";
import { useClockStore } from "./useClockStore";
import { defineStore } from "pinia";

export const useShopStore = defineStore("useShopStore", () => {
  const wasmStore = useWasmStore();
  const clockStore = useClockStore();
  const gameStore = useGameStore();
  const state = ref(empty());
  return {
    state,
    shopInfo(): void {
      gameStore.send("live_game_hand");
      gameStore.send("live_game_confirmed");
    },

    setConfirmed(data: [boolean, boolean]) {
      state.value.confirmed = data;
      if (!data.includes(false)) {
        return ;
      }

      data.includes(true) ? this.startClock() : null;
    },

    setHand(hand: string) {
      wasmStore.shop().set_hand(hand);
      state.value.pieceCounter = wasmStore
        .shop()
        .shop_items(gameStore.playerColor());
      const moves: string[] = wasmStore.shop().history();
      gameStore.addMoves(0, moves);
      state.value.credit = wasmStore.shop().get_credit(gameStore.playerColor());
      gameStore.other.index = gameStore.state.history[0].length - 2;
    },

    buy(p: string, color: string) {

      if (this.canShop()) {
        const game_move = `+${p}`;
        state.value.pieceCounter = wasmStore.shop().buy(game_move);

        state.value.pieceCounter[0] = 1;
        const new_credit = wasmStore.shop().get_credit(color);
        const _ = wasmStore.shop().get_piece(p);
        if (new_credit != state.value.credit) {
          gameStore.addMove(0, game_move);
          gameStore.scrollToBottom();
        }
        gameStore.send("live_game_buy", game_move);
        gameStore.other.index = gameStore.state.history[0].length - 2;
        state.value.credit = new_credit;
      }
    },

    confirm() {
      if (this.canShop()) {
        wasmStore.shop().confirm(gameStore.playerColor());
        if (wasmStore.shop().is_confirmed(gameStore.playerColor())) {
          gameStore.send("live_game_confirm", "cc");
          clockStore.pause(gameStore.player().player);
          state.value.confirmed[gameStore.player().player] = true;
        }
      }
    },

    startClock() {
      const elapsed = clockStore.elapsed();
      const confirmed = state.value.confirmed.findIndex((item) => item == true);
      if (confirmed != -1) {
        clockStore.setTime(
          confirmed,
          gameStore.state.tc.clocks[confirmed] - elapsed
        );
        clockStore.pause(confirmed, false);
        const other = clockStore.otherClock(confirmed);
        clockStore.start(other);
        return;
      }
      else {
        clockStore.startBoth(elapsed, gameStore.state.tc.clocks);
      }
    },

    amIConfirmed(): boolean {
      return state.value.confirmed[gameStore.player().player];
    },

    canPlay(): boolean {
      if (
        gameStore.state.side_to_move == gameStore.player().player &&
        gameStore.state.status < 1
      ) {
        return true;
      }
      return false;
    },

    canShop(): boolean {
      return (
        gameStore.player().isPlayer &&
        gameStore.state.current_stage == 0 &&
        gameStore.state.status < 0 &&
        !this.amIConfirmed()
      );
    },

    pieceCounter() {
      return state.value.pieceCounter;
    },

    credit() {
      return state.value.credit;
    },

    reset() {
      state.value = empty();
    }
  };
});

function empty(): State {
  return {
    confirmed: [false, false],
    pieceCounter: new Uint8Array(),
    credit: 800,
  };
}

type State = {
  confirmed: [boolean, boolean];
  pieceCounter: Uint8Array;
  credit: number;
};
