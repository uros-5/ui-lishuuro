import { defineStore } from 'pinia'

export const useVariantHome = defineStore('variantHome', {
  state: () => {
    return { clickedVariant: "" }
  },
  actions: {
    changeVariant(s: string): void { this.clickedVariant = s; }
  },
})
