import {
    createRouter,
    createWebHistory,
    createWebHashHistory
} from 'vue-router'
const home = () =>
    import ("@/components/Home");
const dashboard = () =>
    import ("@/views/dashboard/index");
const main = () =>
    import ("@/views/dashboard/main/index");

const routes = [{
        path: '/',
        redirect: '/dashboard'
    },
    {
        path: '/',
        component: home,
        children: [{
            path: '/dashboard',
            name: 'dashboard',
            component: main,
            meta: {
                keepAlive: true,
                title: ''
            }
        }]
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/'
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    // history: createWebHashHistory(process.env.BASE_URL),
    routes
})

export default router