import GET from "@/plugins/axios";
import { defineStore } from "pinia";
import { useCookies } from "vue3-cookies";

const cookie = useCookies().cookies;
const cookieData = { expire: "365d", sameSite: "" };

export const useUser = defineStore("useUser", {
  state: () => {
    return { username: "", reg: false };
  },
  actions: {
    checkCookie() {
      console.log(cookie);
      if (cookie.get("username") == null) {
        this.updateAnonCookie();
      } else {
         this.$state.username = cookie.get("username")
       this.$state.reg = cookie.get("reg");
      }
    },
    updateAnonCookie() {
      GET("vue_user").then((res) => {
        this.setUser(res.data.username, res.data.reg);
      });
    },
    setUser(username: string, reg: boolean) {
      this.$state.username = username;
      this.$state.reg = reg;
      cookie.set("username", username, cookieData);
      cookie.set("reg", reg, cookieData);
    },
  },
});
