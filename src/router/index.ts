import { useStore } from "@/store";
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  { path: "/home", name: "Home", component: () => import(/* webpackChunkName: "about" */ "../views/Home.vue") },
  { path: "/account", name: "Account", component: () => import(/* webpackChunkName: "about" */ "../views/Account.vue") },
  { path: "/play", name: "Play", component: () => import(/* webpackChunkName: "about" */ "../views/Play.vue") },
  { path: "/find", name: "Find", component: () => import(/* webpackChunkName: "about" */ "../views/Find.vue") },
  { path: "/logout", name: "Logout", component: () => import(/* webpackChunkName: "about" */ "../views/Logout.vue") },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
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
  store.toggleFalse();
  next();
});

export default router;
