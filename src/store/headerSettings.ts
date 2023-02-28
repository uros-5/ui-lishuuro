import { defineStore } from "pinia";

export const useHeaderSettings = defineStore("headerSettings", {
  state: (): HeaderSettings => {
    return hs();
  },
  actions: {
    toggle() {
      const self = this;
      function close() {
        self.show = false;
        document
          .querySelector("#main-wrap")
          ?.removeEventListener("click", close, false);
      }
      this.show = !this.show;
      if (this.show) {
        document.querySelector("#main-wrap")?.addEventListener("click", close);
      } else {
        close();
      }
    },
    click(c: Clicked) {
      this.clicked = c;
    },
    setTheme(theme: string) {
      document.querySelector("html")?.setAttribute("data-theme", theme);
      this.theme = theme;
      localStorage.setItem("theme", theme);
    },
    setBoardImg(image: number) {
      if ([0, 1, 2, 3, 4, 5].includes(image)) {
        localStorage.setItem("board", `${image}`);
        this.board = `${image}`;
      }
    },
    setPieceImg(image: number) {
      if ([0, 1, 2].includes(image)) {
        localStorage.setItem("piece", `${image}`);
        this.piece = `${image}`;
      }
    },
    getTheme(): string {
      return this.theme;
    },
    getBoard(): string {
      console.log(this.board);
      return `board-${this.board}`;
    },
    getPiece(): string {
      return `piece-${this.piece}`;
    },
    zoom() {
      document
        .querySelector(".round")
        ?.setAttribute("style", `--zoom: ${this.currentZoom}`);
    },
  },
});

interface HeaderSettings {
  show: boolean;
  clicked: Clicked;
  theme: string;
  board: string;
  piece: string;
  currentZoom: string;
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
  return {
    show: false,
    clicked: "",
    board: board,
    piece: piece,
    theme: theme,
    currentZoom: zoom,
  };
}
