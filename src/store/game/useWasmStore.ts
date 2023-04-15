import { ref } from "vue";
import { defineStore } from "pinia";
import { ShuuroPosition, ShuuroShop } from "shuuro-wasm";
import init from "shuuro-wasm";
import { useGameStore } from ".";

export const useWasmStore = defineStore("useWasmStore", async () => {
  const wasm = ref(await emptyWasm())
  const { game } = useGameStore();

  const changeVariant = (w?: ShuuroShop | ShuuroPosition) => {
    const variant = game.variant;
    if (variant == "shuuro") {
      game.variant = "shuuro";
      return;
    }
    if (!wasm.value.init) return ;
    const wasm_ = w ? w : wasm.value.wasm![game.current_stage]!
    wasm_.change_variant(variant);
  };

  return { wasm, changeVariant }
});

async function emptyWasm(): Promise<WasmStore> {
  const output = await init();
  if (output) {
    const shop = new ShuuroShop();
    const placement = new ShuuroPosition("shuuro");
    const fight = new ShuuroPosition("shuuro");
    return {
      init: true,
      wasm: [shop, placement, fight]
    }
  }
  else {
    return {
      init: false,
      wasm: [undefined, undefined, undefined]
    }
  }
}

export type BoardWasm = [ShuuroShop, ShuuroPosition, ShuuroPosition];
export type WasmStore = {
  init: boolean;
  wasm: BoardWasm | [undefined, undefined, undefined];
};
