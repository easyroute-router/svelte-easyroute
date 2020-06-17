import MainLayout from "../Layout/MainLayout.svelte";
import Router from "../../../lib/dist";

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
            }
        ]
    },
]

const router = new Router({
    mode: 'hash',
    routes
})


export default router