import { defineStore } from "pinia";
import { z } from "zod";

export const HeaderSettings = z.object(
  {
    theme: z.string(),
    board: z.string(),
    piece: z.string(),
    currentZoom: z.string(),
    volume: z.string(),
  }
).default(
  { theme: "dark", board: "0", piece: "0", currentZoom: "100", volume: "1" }
);

export type HeaderSettings = z.infer<typeof HeaderSettings>;

export const useHeaderSettings = defineStore("headerSettings", {
  state: (): Store => {
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
    str() {
      localStorage.setItem("settings", JSON.stringify(this.settings))
    },

    click(c: Clicked) {
      this.clicked = c;
    },
    setTheme(theme: string) {
      document.querySelector("html")?.setAttribute("data-theme", theme);
      this.settings.theme = theme;
      this.str();
    },
    setBoardImg(image: number) {
      if ([0, 1, 2, 3, 4, 5].includes(image)) {
        this.str();
        this.settings.board = `${image}`;
      }
    },
    setPieceImg(image: number) {
      if ([0, 1, 2].includes(image)) {
        this.str();
        this.settings.piece = `${image}`;
      }
    },
    setVolume(sound: string) {
      this.str();
      this.settings.volume = sound;
    },
    getTheme(): string {
      return this.settings.theme;
    },
    getBoard(): string {
      return `board-${this.settings.board}`;
    },
    getPiece(): string {
      return `piece-${this.settings.piece}`;
    },
    getVariant(variant: string): string {
      return variant.startsWith("shuuro") ? `${12}` : `${8}`;
    },
    getSound(): string {
      return this.settings.volume;
    },
    zoom() {
      document
        .querySelector(".round")
        ?.setAttribute("style", `--zoom: ${this.settings.currentZoom}`);
    },
  },
});

interface Store {
  show: boolean,
  clicked: Clicked,
  settings: HeaderSettings
}

type Clicked = "" | "background" | "board" | "sound";

function hs(): Store {
  const storage = localStorage.getItem("settings");
  let settings: HeaderSettings = HeaderSettings.parse(undefined);
  if (storage != undefined) {
    let data = HeaderSettings.safeParse(JSON.parse(storage));
    if (data) {
      settings = JSON.parse(storage)
    }
  }

  return {
    show: false,
    clicked: "",
    settings
  };
}
