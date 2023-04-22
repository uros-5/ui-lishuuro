import { ShuuroPosition, ShuuroShop } from "shuuro-wasm";
import init from "shuuro-wasm";
import { ref } from "vue";
import { defineStore } from "pinia";

export const useWasmStore = defineStore("useWasmStore", () => {
  const state = ref(empty());

  return {
    state,
    async init() {
      let i = await init();
      state.value.wasm[0] = new ShuuroShop();
      state.value.wasm[1] = new ShuuroPosition("shuuro");
      state.value.wasm[2] = new ShuuroPosition("shuuro");
      state.value.analyzeWasm = new ShuuroPosition("shuuro");
    },

    changeVariant(variant: string) {
      [0, 1, 2].forEach((item) =>
        state.value.wasm[item]!.change_variant(variant)
      );
    },

    shop(): ShuuroShop {
      return state.value.wasm[0]!;
    },

    placement(): ShuuroPosition {
      return state.value.wasm[1]!;
    },

    fight(): ShuuroPosition {
      return state.value.wasm[2]!;
    },

    analyze(): ShuuroPosition {
      return state.value.analyzeWasm!;
    },

    reset() {
      state.value = empty();
    }
  };
});

type WasmStore = {
  wasm: [
    ShuuroShop | undefined,
    ShuuroPosition | undefined,
    ShuuroPosition | undefined
  ];
  analyzeWasm: ShuuroPosition | undefined;
  init: boolean;
};

function empty(): WasmStore {
  return {
    wasm: [undefined, undefined, undefined],
    analyzeWasm: undefined,
    init: false
  }
}
