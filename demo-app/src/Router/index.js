import MainLayout from "../Layout/MainLayout.svelte";
import NotFound from "../Pages/NotFound.svelte"
// import Router from '../../../lib/index'

const _router = import(/* webpackChunkName: "router" */ '../../../lib/index.js')

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

export default async function createRouter() {
    const module = await _router
    const Router = module.default
    const router = new Router({
        mode: 'hash',
        routes
    })
    return router
}