import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/MyHome.vue';
import TimeTools from '../views/TimeTools.vue';
import ParseJson from '../views/ParseJson.vue';
import Profile from '../views/ProfilePage.vue';
import Security from '../views/SecurityPage.vue';

const routes = [
    { path: '/', component: Home },
    { path: '/tools', component: Home },
    { path: '/tools/timeTools', component: TimeTools },
    { path: '/tools/parseJson', component: ParseJson },
    { path: '/tools/profile', component: Profile },
    { path: '/tools/security', component: Security },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
