import {createRouter, createWebHashHistory} from 'vue-router';
import Home from '../views/MyHome.vue';
import TimeTools from '../views/TimeTools.vue';
import ParseJson from '../views/ParseJson.vue';
import Profile from '../views/ProfilePage.vue';
import Security from '../views/SecurityPage.vue';

const routes = [
    { path: '/', component: Home },
    { path: '/timeTools', component: TimeTools },
    { path: '/parseJson', component: ParseJson },
    { path: '/profile', component: Profile },
    { path: '/security', component: Security },
];

const router = createRouter({
    history: createWebHashHistory(), // 使用 hash 模式
    routes,
});

export default router;
