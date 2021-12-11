import { useStore } from '@/store';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue')
	},
	{
		path: '/home',
		name: 'Home',
		component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue')
	},
	{
		path: '/account',
		name: 'Account',
		component: () => import(/* webpackChunkName: "account" */ '../views/Account.vue')
	},
	{
		path: '/play',
		name: 'Play',
		component: () => import(/* webpackChunkName: "play" */ '../views/Play.vue')
	},
	{
		path: '/find',
		name: 'Find',
		component: () => import(/* webpackChunkName: "find" */ '../views/Find.vue')
	},
	{
		path: '/logout',
		name: 'Logout',
		component: () => import(/* webpackChunkName: "login" */ '../views/Logout.vue')
	},
	{
		path: '/about',
		name: 'About',
		component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
	},
	{
		path: '/login',
		name: 'Login',
		component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue')
	},
	{
		path: '/register',
		name: 'Register',
		component: () => import(/* webpackChunkName: "register" */ '../views/Register.vue')
	}
];
console.log(process);
const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes
});

router.beforeEach((to, from, next) => {
	const store = useStore();
	// we wanted to use the store here
	store.toggleFalse();
	next();
});

export default router;
