import MainLayout from '../Layout/MainLayout.svelte'
import NotFound from '../Pages/NotFound.svelte'
import { fetchSlugMarkdown } from './utils'
import Router from '@router'
import nprogress from 'nprogress'
import { langStore } from '../Store'

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
        beforeEnter: async (to, from, next) => {
          console.log(`[beforeEnter hook]: fetching page data`)
          const { slug } = to.params
          try {
            to.meta.pageText = await fetchSlugMarkdown(slug)
            const titlePart = to.meta.pageText
              .split('\n')[0]
              .replace(/^(#+ )/, '')
            document.title = titlePart
              ? `${titlePart} | Svelte Easyroute`
              : 'Svelte Easyroute'
            next()
          } catch (e) {
            console.error(e)
            next('/not-found')
          }
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
  }
]

const router = new Router({
  mode: 'history',
  omitTrailingSlash: true,
  routes
})

router.beforeEach = async (to, from, next) => {
  const { lang } = to.query
  if (lang === 'ru' || lang === 'en') langStore.set(lang)
  else langStore.set('en')

  nprogress.start()
  if (to.name === 'Page') next()
  document.title = to.meta.title
    ? `${to.meta.title} | Svelte Easyroute`
    : 'Svelte Easyroute'
  next()
}

router.afterEach = () => {
  nprogress.done()
}

export default router
