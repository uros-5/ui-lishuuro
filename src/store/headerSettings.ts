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
    setVolume(sound: string) {
      localStorage.setItem("volume", sound);
      this.volume = sound;
    },
    getTheme(): string {
      return this.theme;
    },
    getBoard(): string {
      return `board-${this.board}`;
    },
    getPiece(): string {
      return `piece-${this.piece}`;
    },
    getVariant(variant: string): string {
      return variant.startsWith("shuuro") ? `${12}` : `${8}`;
    },
    getSound(): string {
      return this.volume;
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
  volume: string;
}
type Clicked = "" | "background" | "board" | "sound";

function hs(): HeaderSettings {
  let theme = localStorage.getItem("theme");
  theme = theme == null ? "dark" : theme;
  let board = localStorage.getItem("board");
  board = board == null ? "0" : board;
  let currentZoom = localStorage.getItem("zoom");
  currentZoom = currentZoom == null ? "100" : currentZoom;
  let piece = localStorage.getItem("piece");
  piece = piece == null ? "0" : piece;
  let sound = localStorage.getItem("sound");
  sound = sound == null ? "1" : sound;
  return {
    show: false,
    clicked: "",
    board,
    piece,
    theme,
    currentZoom,
    volume: sound
  };
}
