import { defineStore } from "pinia";

export const useBoardSize = defineStore("boardSize", {
  state: () => {
    return { height: 0, rowsAndCols: 8 };
  },
  actions: {
    updateHeight(size: number): void {
      this.height = size;
    },
    updateRowsAndCols(n: number): void {
      this.rowsAndCols = n;
    }, // eslint-disable-next-line
    resize(_event: Event) {
      this.updateHeight(
        (document.querySelector("#mainboard")! as HTMLElement).offsetWidth!
      );
    },
    genVars(): string {
      return `--cg-width: ${this.height}px; --cg-height: ${this.height}px;`;
    },
    cgContainerStyle(): string {
      const height = this.height;
      return `width: ${height}px; height: ${height}px;`;
    },
  },
});
