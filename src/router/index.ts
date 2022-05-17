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
    path: "/news/:id",
    component: () =>
      import(/* webpackChunkName: "News" */ "@/views/NewsItem.vue"),
  },
  {
    path: "/@/:username",
    component: () =>
      import(/* webpackChunkName: "User" */ "@/views/UserProfile.vue"),
  },
  {
    path: "/tv",
    component: () => import(/* webpackChunkName: "Tv" */ "@/views/Tv.vue"),
  },
  {
    path: "/players",
    component: () =>
      import(/* webpackChunkName: "Players" */ "@/views/Players.vue"),
  },
  {
    path: "/tournaments",
    component: () =>
      import(/* webpackChunkName: "Tournaments" */ "@/views/Tournaments.vue"),
  },
  {
    path: "/shuuro/",
    component: () =>
      import(
        /* webpackChunkName: "ShuuroLayout" */ "@/components/ShuuroLayout.vue"
      ),
    children: [
      {
        path: "0/:id",
        component: () =>
          import(/* webpackChunkName: "ShuuroShop" */ "@/views/ShuuroShop.vue"),
      },
      {
        path: "1/:id",
        component: () =>
          import(/* webpackChunkName: "ShuuroSet" */ "@/views/ShuuroSet.vue"),
      },
      {
        path: "2/:id",
        component: () =>
          import(/* webpackChunkName: "ShuuroSet" */ "@/views/ShuuroPlay.vue"),
      },
    ],
  },
];

//

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
