import MainLayout from "../Layout/MainLayout.svelte";
import NotFound from "../Pages/NotFound.svelte"
import {fetchSlugMarkdown} from "./utils";
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
                meta: {
                    test: 'test'
                },
                component: () => import(/*webpackChunkName: "mdpage" */ '../Pages/Markdown.svelte')
            },
            {
                path: 'playground/:param1/:param2',
                component: () => import(/* webpackChunkName: "playground" */ '../Pages/Playground.svelte')
            },
            {
                path: '(.*)',
                component: NotFound
            },
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

    router.beforeEach = async (to, from, next) => {
        if (to.name === 'Page') {
            console.log(`[BeforeEachHook]: fetching page data`)
            const {slug} = to.params
            try {
                const data = await fetchSlugMarkdown(slug)
                to.meta.pageText = data
                next()
            } catch (e) {
                console.error(e)
                next('/not-found')
            }
        } else next()
    }

    return router
}