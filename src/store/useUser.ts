import GET from "@/plugins/axios";
import { defineStore } from "pinia";
import { useCookies } from "vue3-cookies";

const cookie = useCookies().cookies;
const cookieData = { expire: "365d", sameSite: "" };

export const useUser = defineStore("useUser", {
  state: () => {
    return { username: "", reg: false, plCount: 0, gamesCount: 0 };
  },
  actions: {
    checkCookie() {console.log(cookie.get('username'));
      if (cookie.get("username") == null) {
        this.updateAnonCookie();
      } else {
        this.$state.username = cookie.get("username");
        this.$state.reg = JSON.parse(cookie.get("reg"));
      }
    },
    updateAnonCookie() {
      GET("vue_user").then((res) => {
        this.setUser(res.data.username, res.data.logged);
      });
    },
    setUser(username: string, reg: boolean) {console.log(username);
      this.$state.username = username;
      this.$state.reg = reg;
      cookie.set("username", username, cookieData);
      cookie.set("reg", reg, cookieData);
    },
    updatePlCount(cnt: number): void {
      this.$state.plCount = cnt;
    },
    updateGamesCount(cnt: number): void {
      this.$state.gamesCount = cnt;
    },
  },
});
