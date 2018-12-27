import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/dashboard/Home.vue';
import Auth from './views/Auth.vue';
import Dashboard from './views/Dashboard.vue';
import Login from './views/auth/Login.vue';
import SignUp from './views/auth/SignUp.vue';

Vue.use(Router);

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            redirect: 'auth',
        },
        {
            path: '/auth',
            component: Auth,
            children: [
                {
                    path: '',
                    redirect: 'login',
                },
                {
                    path: 'login',
                    component: Login,
                },
                {
                    path: 'signUp',
                    component: SignUp,
                },
            ],
        },
        {
            path: '/dashboard',
            component: () => import(/* webpackChunkName: "dashboard" */ './views/Dashboard.vue'),
            children: [
                {
                    path: '',
                    redirect: 'home',
                },
                {
                    path: 'profile',
                    component: () =>
                        import(/* webpackChunkName: "profile" */ './views/dashboard/Profile.vue'),
                },
                {
                    path: 'home',
                    name: 'home',
                    component: () =>
                        import(/* webpackChunkName: "home" */ './views/dashboard/Home.vue'),
                },
                {
                    path: 'accounts',
                    name: 'accounts',
                    // component: Users,
                    component: () =>
                        import(/* webpackChunkName: "accounts" */ './views/dashboard/Accounts.vue'),
                },
                {
                    path: 'about',
                    name: 'about',
                    // route level code-splitting
                    // this generates a separate chunk (about.[hash].js) for this route
                    // which is lazy-loaded when the route is visited.
                    component: () =>
                        import(/* webpackChunkName: "about" */ './views/dashboard/About.vue'),
                },
            ],
        },
    ],
});
