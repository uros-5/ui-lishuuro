import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { useStore } from "@/store";
import Home from "../views/Home.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: () =>
      import(/* webpackChunkName: "AppLayout" */ "../components/AppLayout.vue"),
    children: [
      {
        path: "",
        component: () =>
          import(/* webpackChunkName: "home" */ "../views/Home.vue"),
      },
      {
        path: "/home",
        component: () =>
          import(/* webpackChunkName: "home" */ "../views/Home.vue"),
      },
      {
        path: "/login",
        name: "Login",
        component: () =>
          import(/* webpackChunkName: "login" */ "../views/Login.vue"),
      },
      {
        path: "/register",
        name: "Register",
        component: () =>
          import(/* webpackChunkName: "register" */ "../views/Register.vue"),
      },
      {
        path: "/play",
        name: "Play",
        component: () =>
          import(/* webpackChunkName: "play" */ "../views/Play.vue"),
      },
      {
        path: "/search",
        name: "Search",
        component: () =>
          import(/* webpackChunkName: "search" */ "../views/Search.vue"),
      },
      {
        path: "/logout",
        name: "Logout",
        component: () =>
          import(/* webpackChunkName: "login" */ "../views/Logout.vue"),
      },
      {
        path: "/my_games",
        name: "MyGames",
        component: () =>
          import(/* webpackChunkName: "my_games" */ "../views/MyGames.vue"),
      },
      {
        path: "/account",
        name: "Account",
        component: () =>
          import(/* webpackChunkName: "account" */ "../views/Account.vue"),
      },
      {
        path: "/support",
        name: "Support",
        component: () =>
          import(/* webpackChunkName: "support" */ "../views/Support.vue"),
      },
      {
        path: "/shuuroShop/:id",
        name: "Support",
        component: () =>
          import(
            /* webpackChunkName: "shuuro_shop" */ "../views/ShuuroShop.vue"
          ),
      },
      {
        path: "/shuuroSet/:id",
        name: "ShuuroSet",
        component: () =>
          import(/* webpackChunkName: "shuuro_set" */ "../views/ShuuroSet.vue"),
      },
      {
        path: "/shuuroMatch/:id",
        name: "ShuuroMatch",
        component: () =>
          import(
            /* webpackChunkName: "shuuro_match" */ "../views/ShuuroMatch.vue"
          ),
      },
    ],
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Home.vue"),
  },
];
console.log(process);
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const store = useStore();
  // we wanted to use the store here
  if (store.$state.navVisible == true) {
    store.toggleFalse();
  }

  next();
});

export default router;
