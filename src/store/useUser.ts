import GET from "@/plugins/axios";
import { defineStore } from "pinia";
import { useCookie } from "vue-cookie-next";

export const cookie = useCookie();
const cookieData = { expire: "1d", sameSite: "" };

export const useUser = defineStore("useUser", {
  state: () => {
    return { uID: "", username: "" };
  },
  actions: {
    checkCookie() {
      if (cookie.getCookie("uID") == null) {
        this.updateAnonCookie();
      } else {
      }
    },
    updateAnonCookie() {
      GET("newAnon").then((res) => {
        this.setUser(res.data.uID, res.data.username);
      });
    },
    setUser(uID: string, username: string) {
      this.$state.uID = uID;
      this.$state.username = username;
      cookie.setCookie("username", username, cookieData);
      cookie.setCookie("uID", uID, cookieData);
    },
  },
});
