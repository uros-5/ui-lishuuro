import { ref } from "vue";
import { defineStore } from "pinia";
import { useUser } from "../useUser";
import { ShuuroShop } from "shuuro-wasm";
import { useWasmStore } from "./useWasmStore";
import { useGameStore } from ".";
import { useCgStore } from "./useCgStore";

export const useShopStore = defineStore("useShopStore", async () => {
  const { game, send } = useGameStore();
  const shop = ref(emptyShop());
  const user = useUser();
  const { cg } = useCgStore();
  const { wasm, changeVariant } = await useWasmStore();

  const shopInfo = (): void => {
    send("live_game_hand");
    send("live_game_confirmed");
  };


  const setShuuroHand = (hand: string) => {
    if (wasm.value.init && wasm.value.wasm[0]) {
      wasm.value.wasm[0] = new ShuuroShop();
      changeVariant();
      wasm.value.wasm[0].set_hand(hand);
      shop.value.piece_counter = wasm.value.wasm[0].shop_items(cg.player_color);
      const h: string[] = wasm.value.wasm[0].history();
      game.history[0] = h;
      shop.value.credit = wasm.value.wasm[0].get_credit(
        cg.player_color!
      );
    }
  };

  const pieces = (): string[] => {
    const pieces = [
      "k-piece",
      "q-piece",
      "r-piece",
      "b-piece",
      "n-piece",
      "p-piece",
      "c-piece",
      "a-piece",
      "g-piece",
    ];

    if (!game.variant.endsWith("Fairy")) {
      return pieces.slice(0, 6);
    }
    return pieces;
  };

  const dataPrice = (): Uint8Array => {
    const data = new Uint8Array([0, 110, 70, 40, 40, 10, 130, 130, 70]);
    if (!game.variant.endsWith("Fairy")) {
      return data.slice(0, 6);
    }
    return data;
  };

 const confirm = (username: string) => {
    if (canShop()) {
      wasm.value.wasm[0]!.confirm(cg.player_color!);
      if (wasm.value.wasm[0]!.is_confirmed(cg.player_color!)) {
        send("live_game_confirm", "cc");
        // this.clockPause(cg.player);
        shop.value.confirmed_players![cg.player!] = true;
      }
    }
  };

  const amIConfirmed = (): boolean => {
    return shop.value.confirmed_players![cg.player];
  };


  const canShop = (): boolean => {
    return (
      cg.am_i_player! &&
      game.current_stage! == 0 &&
      game.status < 0 &&
      !amIConfirmed()
    );
  }


  // get from server confirmed and set
  const setConfirmed = (data: [boolean, boolean]) => {
    shop.value.confirmed_players = data;
    // this.activateClock();
  };
  return { shop, setShuuroHand, setConfirmed }
});

export function emptyShop(): ShopStore {
  return { credit: 800, piece_counter: new Uint8Array(10), confirmed_players: [false, false] }
}

export type ShopStore = {
  credit: number;
  piece_counter: Uint8Array;
  confirmed_players?: [boolean, boolean];
}
