import '@babel/polyfill'
import Router from 'easyroute-core'

let windowSpy

const config = {
  mode: 'history',
  routes: [
    {
      name: 'Route1',
      path: '/route1',
      component: () => 'route1'
    }
  ]
}

describe('Basic funcs', () => {
  let router

  beforeEach(() => {
    windowSpy = jest.spyOn(global, 'window', 'get')
  })

  afterEach(() => {
    windowSpy.mockRestore()
  })

  it('Should throw error if no config passed', () => {
    expect(() => {
      router = new Router()
    }).toThrowError()
  })

  it('Creates instance', () => {
    expect(() => {
      router = new Router(config)
    }).not.toThrowError()
  })

  it('Returns empty string if base url is nullable', () => {
    expect(router.base).toBe('')
  })

  it('Adds event listener on popstate event in history mode', (done) => {
    const listeners = []
    windowSpy.mockImplementation(() => ({
      location: {
        pathname: '/'
      },
      addEventListener: function (evtName, listener) {
        listeners.push(evtName)
      },
      history: {
        pushState: () => true
      }
    }))
    router = new Router(config)
    setTimeout(() => {
      expect(listeners.includes('popstate')).toBeTruthy()
      done()
    }, 0)
  })

  it('Adds event listener on hashchange event in hash mode', (done) => {
    const configOverride = { ...config, mode: 'hash' }
    const listeners = []
    windowSpy.mockImplementation(() => ({
      location: {
        pathname: '/'
      },
      addEventListener: function (evtName, listener) {
        listeners.push(evtName)
      }
    }))
    router = new Router(configOverride)
    setTimeout(() => {
      expect(listeners.includes('hashchange')).toBeTruthy()
      done()
    }, 0)
  })

  it('Executes beforeEnter hook', (done) => {
    let hookState = 'NOT_RUNNING'
    config.routes[0].beforeEnter = (to, from, next) => {
      hookState = 'RUNNING'
      next('/')
    }
    router = new Router(config)
    router.push('/route1')
    setTimeout(() => {
      expect(hookState).toBe('RUNNING')
      done()
    }, 0)
  })

  it('Skips nonexistent before hook', (done) => {
    let hookState = 'NOT_RUNNING'
    config.routes[0].beforeEnter = undefined
    router = new Router(config)
    router.push('/route1')
    setTimeout(() => {
      expect(hookState).toBe('NOT_RUNNING')
      done()
    }, 0)
  })
})
