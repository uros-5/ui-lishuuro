import GET from "@/plugins/axios";
import { getProd } from "@/plugins/getBackend";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useCookies } from "vue3-cookies";

const cookie = useCookies().cookies;
const _cookieData = { expire: "365d", sameSite: "" };
const themes = ["dark", "light"];

type VueUser = { username: string; logged: boolean };

export const useUser = defineStore("useUser", () => {
  const user = ref({
    username: "",
    reg: false,
    con: true,
    conMsg: "Reconnecting",
    theme: "light",
    plCount: 0,
    gamesCount: 0,
  });

  const checkCookie = () => {
    if (cookie.get("username") == null) {
      updateAnonCookie();
    } else {
      updateAnonCookie();
      user.value.username = cookie.get("username");
      user.value.reg = JSON.parse(cookie.get("reg"));
    }
  };

  const updateAnonCookie = () => {
    GET("vue_user").then((res) => {
      let data: VueUser = res.data;
      setUser(data);
    });
  };

  const setUser = (vueUser: VueUser) => {
    user.value.username = vueUser.username;
    user.value.reg = vueUser.logged;
    const prod = getProd();
    const d = new Date();
    d.setTime(d.getTime() + 60 * 60 * 24 * 365);
    cookie.set(
      "username",
      user.value.username,
      d.toUTCString(),
      "",
      "",
      prod,
      "Lax"
    );
    cookie.set(
      "reg",
      user.value.reg.toString(),
      d.toUTCString(),
      "",
      "",
      prod,
      "Lax"
    );
  };

  const onReconnect = () => {
    user.value.con = false;
    document.body.classList.add("offline");
    document.body.classList.remove("online");
    document.body.classList.add("reconnected");
  };

  const onOpen = () => {
    user.value.con = true;
    document.body.classList.add("online");
    document.body.classList.remove("offline");
    user.value.conMsg = "Reconnecting";
  };

  const getTheme = (): string => {
    const theme = cookie.get("theme");
    if (themes.includes(theme)) {
      return theme;
    }
    return "dark";
  };

  const toggleHeader = () => {
    document
      .querySelectorAll(".topnav a")
      .forEach((t) => t.classList.toggle("navbar-show")),
      document.querySelector(".hamburger")?.classList.toggle("is-active");
  };

  const setTheme = (theme: string) => {
    cookie.set("theme", theme);
    document.querySelector("html")?.setAttribute("data-theme", theme);
  };

  return {
    user,
    checkCookie,
    updateAnonCookie,
    setUser,
    onReconnect,
    onOpen,
    getTheme,
    setTheme,
    toggleHeader
  };
});
