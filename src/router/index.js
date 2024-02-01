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
const paymentHistory = () =>
    import ("@/components/paymentHistory");
const UBIHistory = () =>
    import ("@/components/UBIHistory");

const routes = [{
        path: '/',
        redirect: '/provider-status'
    },
    {
        path: '/',
        component: home,
        children: [{
                path: '/provider-status',
                name: 'dashboard',
                component: main,
                meta: {
                    keepAlive: true,
                    title: ''
                }
            },
            {
                path: '/payment-history',
                name: 'paymentHistory',
                component: paymentHistory,
                meta: {
                    keepAlive: true,
                    title: ''
                },
                beforeEnter: (to, from, next) => {
                    if (!sessionStorage.getItem('access_token_swan')) {
                        next({
                            path: '/provider-status'
                        })
                    } else {
                        next()
                    }
                }
            },
            {
                path: '/UBI-reward-history',
                name: 'UBIHistory',
                component: UBIHistory,
                meta: {
                    keepAlive: true,
                    title: ''
                },
                beforeEnter: (to, from, next) => {
                    if (!sessionStorage.getItem('access_token_swan')) {
                        next({
                            path: '/provider-status'
                        })
                    } else {
                        next()
                    }
                }
            }
        ]
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