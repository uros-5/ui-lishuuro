import { defineStore } from "pinia";
import { ShuuroPosition, ShuuroShop } from "shuuro-wasm";
import init from "shuuro-wasm";
import { ref } from "vue";

const useWasmStore = defineStore("useWasmStore", () => {
  const store = ref({ wasm: [undefined, undefined, undefined], analyzeWasm: undefined, init: false } as WasmStore)
  return new class {
    async init() {
      init().then(_exports => {
        store.value.wasm[0] = new ShuuroShop();
        store.value.wasm[1] = new ShuuroPosition("shuuro");
        store.value.wasm[2] = new ShuuroPosition("shuuro");
        store.value.analyzeWasm = new ShuuroPosition("shuuro");
      });
    }

    changeVariant(variant: string) {
      [0, 1, 2].forEach(item => store.value.wasm[item]!.change_variant(variant))
    }

    shop(): ShuuroShop {
      return store.value.wasm[0]!;
    }

    position(): ShuuroPosition {
      return store.value.wasm[1]!;
    }

    fight(): ShuuroPosition {
      return store.value.wasm[2]!;
    }

  }

});

type WasmStore = {
  wasm: [ShuuroShop | undefined, ShuuroPosition | undefined, ShuuroPosition | undefined];
  analyzeWasm: ShuuroPosition | undefined;
  init: boolean;
}