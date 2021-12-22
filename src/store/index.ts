import router from "@/router";
import { defineStore } from "pinia";

export const useStore = defineStore("main", {
  state: () => ({
    navVisible: false,
    email: "",
    username: "",
    password: "",
    password2: "",
    loginOkServer: true,
    registerOkServer: true,
    loginOk: false,
    registerOk: false,
  }),
  getters: {
    navVisible(): boolean {
      return this.navVisible;
    },
  },
  actions: {
    toggle(): void {
      this.$state.navVisible = !this.$state.navVisible;
      document.querySelector(".nav").classList.toggle("navActive");
      const current = document.body.style.overflow;
      switch (current) {
        case "hidden":
          console.log(current);
          document.body.style.overflow = "auto";
          break;
        default:
          document.body.style.overflow = "hidden";
          break;
      }
    },
    toggleFalse(): void {
      this.$state.navVisible = false;
      document.querySelector(".nav").classList.toggle("navActive");
      document.body.style.overflow = "auto";
    },
    checkLogin(): void {
      if (this.$state.username == "test" && this.$state.password == "test") {
        router.push("/");
        this.$state.loginOk = true;
        this.$state.loginOkServer = true;
      } else {
        this.$state.loginOk = false;
        this.$state.loginOkServer = false;
      }
    },
    checkRegister(): void {
      if (this.$state.username.length > 5 && this.$state.username.length < 15) {
        if (this.$state.password == this.$state.password2) {
          this.$state.registerOkServer = true;
          router.push("/login");
          return;
        }
      }
      this.$state.registerOkServer = false;
    },
  },
});
