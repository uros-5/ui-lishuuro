import { defineStore } from "pinia";

export const useHeaderSettings = defineStore("headerSettings", {
  state: (): HeaderSettings => {
    return hs();
  },
  actions: {
    toggle() {
      let self = this;
      function close() {
        self.$state.show = false;
        document
          .querySelector("#main-wrap")
          ?.removeEventListener("click", close, false);
      }
      this.$state.show = !this.$state.show;
      if (this.$state.show) {
        document.querySelector("#main-wrap")?.addEventListener("click", close);
      } else {
        close();
      }
    },
    click(c: Clicked) {
      this.$state.clicked = c;
    },
    setTheme(theme: string) {
      document.querySelector("html")?.setAttribute("data-theme", theme);
      this.$state.theme = theme;
      localStorage.setItem("theme", theme);
    },
    setBoardImg(image: number) {
      if ([0, 1, 2].includes(image)) {
        localStorage.setItem("board", `${image}`);
        this.$state.board = `${image}`;
      }
    },
    setPieceImg(image: number) {
      if ([0,1,2].includes(image)) {
        localStorage.setItem("piece", `${image}`);
        this.$state.piece = `${image}`;
      }
    },
    getTheme(): string {
      return this.$state.theme;
    },
    getBoard(): string {
      return `board-${this.$state.board}`;
    },
    getPiece(): string {
      return `piece-${this.$state.piece}`;
    },
    zoom() {
      document
        .querySelector(".round")
        ?.setAttribute("style", `--zoom: ${this.$state.zoom}`);
    },
  },
});

interface HeaderSettings {
  show: boolean;
  clicked: Clicked;
  theme: string;
  board: string;
  piece: string;
  zoom: string;
}
type Clicked = "" | "background" | "board";

function hs(): HeaderSettings {
  let theme = localStorage.getItem("theme");
  theme = theme == null ? "dark" : theme;
  let board = localStorage.getItem("board");
  board = board == null ? "0" : board;
  let zoom = localStorage.getItem("zoom");
  zoom = zoom == null ? "100" : zoom;
  let piece = localStorage.getItem("piece");
  piece = piece == null ? "0" : piece;
  return { show: false, clicked: "", board: board, piece: piece, theme: theme, zoom: zoom };
}
