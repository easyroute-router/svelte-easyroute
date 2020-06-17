import MainLayout from "../Layout/MainLayout.svelte";
import NotFound from "../Pages/NotFound.svelte"
import Router from '../../../lib/index'

const routes = [
    {
        path: '/',
        component: MainLayout,
        name: 'Index',
        children: [
            {
                path: '',
                component: () => import(/*webpackChunkName: "Index" */ '../Pages/Index.svelte'),
                name: 'Index'
            },
            {
                name: 'Page',
                path: 'page/:slug',
                component: () => import(/*webpackChunkName: "mdpage" */ '../Pages/Markdown.svelte')
            },
            {
                path: '(.*)',
                component: NotFound
            }
        ]
    },
    {
        path: '(.*)',
        component: MainLayout,
        children: [
            {
                path: '(.*)',
                component: NotFound
            }
        ]
    }
]

const router = new Router({
    base: 'easyroute/v2',
    mode: 'history',
    routes
})

export default router