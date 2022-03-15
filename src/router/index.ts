import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: () => import(/* webpackChunkName: "Home" */ "@/views/Home.vue"),
  },
  {
    path: "/logged",
    component: () =>
      import(/* webpackChunkName: "Logged" */ "@/views/Logged.vue"),
  },
  {
    path: "/shuuro/",
    component: () =>
      import(
        /* webpackChunkName: "ShuuroLayout" */ "@/components/ShuuroLayout.vue"
      ),
    children: [
      {
        path: "shop/:id",
        component: () =>
          import(/* webpackChunkName: "ShuuroShop" */ "@/views/ShuuroShop.vue"),
      },
      {
        path: "set/:id",
        component: () =>
          import(/* webpackChunkName: "ShuuroSet" */ "@/views/ShuuroSet.vue"),
      },
      {
        path: "play/:id",
        component: () =>
          import(/* webpackChunkName: "ShuuroSet" */ "@/views/ShuuroPlay.vue"),
      },
    ],
  },
];

//console.log(process);

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
