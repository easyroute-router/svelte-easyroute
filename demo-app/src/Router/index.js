import MainLayout from '../Layout/MainLayout.svelte'
import NotFound from '../Pages/NotFound.svelte'
import { fetchSlugMarkdown } from './utils'
import Router from '../../../lib'
import nprogress from 'nprogress'

const routes = [
  {
    path: '/',
    component: MainLayout,
    name: 'Index',
    children: [
      {
        path: '',
        component: () =>
          import(/*webpackChunkName: "Index" */ '../Pages/Index.svelte'),
        name: 'Index',
        meta: {
          title: 'Welcome'
        }
      },
      {
        name: 'Page',
        path: 'page/:slug',
        meta: {
          test: 'test'
        },
        component: () =>
          import(/*webpackChunkName: "mdpage" */ '../Pages/Markdown.svelte')
      },
      {
        path: 'playground/:param1/:param2',
        meta: {
          title: 'Playground'
        },
        component: () =>
          import(
            /* webpackChunkName: "playground" */ '../Pages/Playground.svelte'
          )
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
  mode: 'history',
  routes
})

router.beforeEach = async (to, from, next) => {
  nprogress.start()
  if (to.name === 'Page') {
    console.log(`[BeforeEachHook]: fetching page data`)
    const { slug } = to.params
    try {
      to.meta.pageText = await fetchSlugMarkdown(slug)
      const titlePart = to.meta.pageText.split('\n')[0].replace(/^(#+ )/, '')
      document.title = titlePart
        ? `${titlePart} | Svelte Easyroute`
        : 'Svelte Easyroute'
      next()
    } catch (e) {
      console.error(e)
      next('/not-found')
    }
  } else {
    document.title = to.meta.title
      ? `${to.meta.title} | Svelte Easyroute`
      : 'Svelte Easyroute'
    next()
  }
}

router.afterEach = () => {
  nprogress.done()
}

export default router
