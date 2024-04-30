import Vue from 'vue';
import VueRouter from 'vue-router';
import TheDashboard from './pages/TheDashboard.vue';
import ContractsPage from './pages/ContractsPage.vue';
import VacationsPage from './pages/VacationsPage.vue';
import TheLogin from './pages/TheLogin.vue';
import store from './store/store';

Vue.use(VueRouter);

const routes = [
    {
        name: 'dashboard',
        path: '/dashboard',
        components: {
            default: TheDashboard
        },
        meta: { layout: 'Logged', requiresAuth: true }
    },
    {
        name: 'contracts',
        path: '/contracts',
        components: {
            default: ContractsPage
        },
        meta: { layout: 'Logged', requiresAuth: true }
    },
    {
        name: 'vacations',
        path: '/vacations',
        components: {
            default: VacationsPage
        },
        meta: { layout: 'Logged', requiresAuth: true }
    },
    {
        name: 'login',
        path: '/login',
        components: {
            default: TheLogin
        },
        meta: {
            layout: 'Default',
            guestOnly: true
        }
    },
    { path: '/:notFound(.*)', redirect: '/login' }
];

const router = new VueRouter({
    routes,
    mode: 'history'
});

router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const isRouteGuestOnly = to.matched.some(record => record.meta.guestOnly);
    const isAuthenticated = store.getters['auth/isAuthenticated'];

    if (!requiresAuth && !isRouteGuestOnly) {
        return next();
    }

    if (requiresAuth) {
        if (isAuthenticated) {
            return next();
        }

        return next({
            name: 'login'
        });
    }

    if (isRouteGuestOnly) {
        if (isAuthenticated) {
            return next({
                name: 'dashboard'
            });
        }

        return next();
    }
});

export default router;
