import MainLayout from '../Layout/MainLayout.svelte'
import NotFound from '../Pages/NotFound.svelte'
import Index from '../Pages/Index.svelte'
import Markdown from '../Pages/Markdown.svelte'
import Playground from '../Pages/Playground.svelte'
import { fetchSlugMarkdown } from './utils'
import Router from '@router'
import { langStore } from '../Store'

const routes = [
  {
    path: '/',
    component: MainLayout,
    name: 'Index',
    children: [
      {
        path: '',
        component: Index,
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
            next()
          } catch (e) {
            console.error(e)
            next('/not-found')
          }
        },
        component: Markdown
      },
      {
        path: 'playground/:param1/:param2',
        meta: {
          title: 'Playground'
        },
        component: Playground
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

router.beforeEach = (to, from, next) => {
  const { lang } = to.query
  if (lang === 'ru' || lang === 'en') langStore.set(lang)
  else langStore.set('en')
  next()
}

export default router
