import Router from '../dist'

const config = {
  mode: 'history',
  routes: [
    {
      name: 'Route1',
      path: '/route1',
      component: () => 'route1'
    },
    {
      name: 'Route2',
      path: '/route2',
      component: () => 'route2',
      children: [
        {
          path: '/route2-1/noslug',
          name: 'Route2-1-noslug',
          component: () => 'route2-1-noslug'
        },
        {
          path: '/route2-1/:slug',
          name: 'Route2-1',
          component: () => 'route2-1-slug'
        }
      ]
    }
  ]
}

describe('Parsing tests', () => {
  let router
  it('creating an instance', (done) => {
    router = new Router(config)
    setTimeout(() => {
      done()
    }, 0)
  })

  it('Correctly sets IDs and parentIDs', () => {
    expect(router.routes[0].parentId).toBe(null)
    expect(router.routes[1].parentId).toBe(null)
    expect(router.routes[1].id).toBe(router.routes[2].parentId)
  })

  it('Correctly finds single-level no-slug route', (done) => {
    router.push('/route1').then(() => {
      expect(router.currentRoute.name).toBe(config.routes[0].name)
      done()
    })
  })

  it('Correctly generates route object on nested routes without slug', (done) => {
    router.push('/route2/route2-1/noslug').then(() => {
      expect(router.currentRoute.name).toBe(config.routes[1].children[0].name)
      done()
    })
  })

  it('Resolves all correct components on nested routes without slug', (done) => {
    router.currentMatched.getValue.forEach((route, idx) => {
      if (idx !== 2) {
        if (idx === 0) {
          expect(route.component()).toBe(config.routes[1].component())
        }
        if (idx === 1) {
          expect(route.component()).toBe(
            config.routes[1].children[0].component()
          )
        }
      }
    })
    done()
  })

  it('Correctly parses path slugs', (done) => {
    router.push('/route2/route2-1/easyroute').then(() => {
      expect(router.currentRoute.params.slug).toBe('easyroute')
      done()
    })
  })

  it('Correctly parses query parameters', (done) => {
    router.push('/route2/route2-1/noslug?test=easyroute').then(() => {
      expect(router.currentRoute.query.test).toBe('easyroute')
      done()
    })
  })
})
