import { defineStore } from "pinia";

export const useBoardSize = defineStore("variantHome", {
  state: () => {
    return { height: 0, rowsAndCols: 8 };
  },
  actions: {
    updateHeight(size: number): void {
      this.height = size;
    },

    updateRowsAndCols(n: number): void {
      this.rowsAndCols = n;
    },
    genVars(): String {
      return `--cg-width: ${this.height}px; --cg-height: ${this.height}px;`;
    },
    resize(event: Event) {
      this.updateHeight(document.querySelector("#mainboard").offsetWidth);
    },
    cgContainerStyle(): string {
      let height = this.height;
      return `width: ${height}px; height: ${height}px;`;
    },
  },
});
