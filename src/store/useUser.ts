import GET from "@/plugins/axios";
import { defineStore } from "pinia";
import { useCookies } from "vue3-cookies";

const cookie = useCookies().cookies;
const cookieData = { expire: "365d", sameSite: "" };

export const useUser = defineStore("useUser", {
  state: () => {
    return {
      username: "",
      reg: false,
      con: true,
      conMsg: "Reconnecting",
      plCount: 0,
      gamesCount: 0,
    };
  },
  actions: {
    checkCookie() {
      if (cookie.get("username") == null) {
        this.updateAnonCookie();
      } else {
        this.updateAnonCookie();
        this.$state.username = cookie.get("username");
        this.$state.reg = JSON.parse(cookie.get("reg"));
      }
    },
    updateAnonCookie() {
      GET("vue_user").then((res) => {
        this.setUser(res.data.username, res.data.logged);
      });
    },
    setUser(username: string, reg: boolean) {
      this.$state.username = username;
      this.$state.reg = reg;
      cookie.set("username", username, cookieData);
      cookie.set("reg", reg.toString(), cookieData);
    },
    updatePlCount(cnt: number): void {
      this.$state.plCount = cnt;
    },
    updateGamesCount(cnt: number): void {
      this.$state.gamesCount = cnt;
    },
    onReconnect() {
      this.$state.con = false;
      document.body.classList.add("offline");
      document.body.classList.remove("online");
      document.body.classList.add("reconnected");
    },
    onOpen() {
      this.$state.con = true;
      document.body.classList.add("online");
      document.body.classList.remove("offline");
      this.$state.conMsg = "Reconnecting";
    },
  },
  getters: {
    username(state): string {
      return state.username;
    },
  },
});
