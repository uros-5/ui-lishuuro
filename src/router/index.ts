import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: () => import(/* webpackChunkName: "Home" */ "@/views/Home.vue"),
  },
  {
    path: "/logged",
    component: () =>
      import(/* webpackChunkName: "Logged" */ "@/views/LoggedUser.vue"),
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
    component: () => import(/* webpackChunkName: "Tv" */ "@/views/LiveTv.vue"),
  },
  {
    path: "/players",
    component: () =>
      import(/* webpackChunkName: "Players" */ "@/views/ActivePlayers.vue"),
  },
  {
    path: "/tournaments",
    component: () =>
      import(
        /* webpackChunkName: "Tournaments" */ "@/views/LiveTournaments.vue"
      ),
  },
  {
    path: "/:variant/",
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
  {
    path: "/:pathMatch(.*)",
    component: () =>
      import(/* webpackChunkName: "PageNotFound" */ "@/views/PageNotFound.vue"),
  },
];

//

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
