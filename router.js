(function () {
  if (typeof window.CustomEvent === 'function') return false // If not IE

  function CustomEvent (event, params) {
    params = params || { bubbles: false, cancelable: false, detail: undefined }
    var evt = document.createEvent('CustomEvent')
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail)
    return evt
  }

  CustomEvent.prototype = window.Event.prototype

  window.CustomEvent = CustomEvent
})() 

import RouterOutlet from './RouterOutlet.svelte' // rollup
import RouterOutlet from "!!svelte-loader!./RouterOutlet.svelte" // webpack

class Router {
  constructor (params) {
    var routes = params
    if (!routes || typeof routes !== 'object') {
      throw Error('Wrong parameters given to Router constructor')
    }
    if (routes.mode !== 'history' && routes.mode !== 'hash') {
      console.warn('SVELTE EASYROUTE: Router "mode" is not set: should be "hash" or "history".\nAuto-setting: "hash"')
      routes.mode = 'hash'
    }
    this.mode = routes.mode
    this.routes = routes.routes
    this.currentRouteComponent = routes.main
    this.afterUpdate = routes.callback
    this.beforeEach = routes.beforeEach | null
    window.routermode = this.mode
    if (this.mode === 'hash') window.onhashchange = this.parseHash.bind(this)
    if (this.mode === 'history') {
      var self = this
      window.addEventListener('svelteEasyrouteLinkClicked', function (event) {
        self.parseHistory(event)
      })
      window.onpopstate = function (event) {
        self.initHistoryMode()
      }
    }
  }

  beforeEachRoute (userFunc, to, from) {
    return new Promise((resolve, reject) => {
      if (!userFunc) resolve()
      userFunc(to, from, resolve)
    })
  }

  createOutlet () {
    let outletDiv = document.getElementById('router-outlet')
    if (!outletDiv) throw Error('Could not find element with id "router-outlet". Router NOT created...')
    let outlet = new RouterOutlet({
      target: document.getElementById('router-outlet'),
      props: {
        router: this
      }
    })
    if (this.mode === 'hash') this.parseHash()
    if (this.mode === 'history') this.initHistoryMode()
    return outlet
  }

  compareRoutes () {
    let routeString = this.currentRoute.route
    routeString = routeString.join('/')
    let routeIdx = this.routes.findIndex((r) => r.path === routeString)
    this.afterUpdate(routeIdx)
  }

  initHistoryMode () {
    let url = window.location.pathname + window.location.search
    let stateObj = { path: url }
    var event = new CustomEvent('svelteEasyrouteLinkClicked',
      {
        'detail': stateObj
      })
    window.dispatchEvent(event)
  }

  async parseHash () {
    if (window.location.hash.indexOf('#') === -1) {
      this.push('/')
    }
    let hash = window.location.hash.replace('#', '')
    var routeArray = hash.split('?')
    var routeInfo = {}
    routeInfo['fullPath'] = routeArray[0]
    routeInfo['route'] = routeArray[0].split('/')
    routeInfo['query'] = {}
    if (routeArray[1]) {
      var routeQuery = routeArray[1].split('&')
      routeQuery.forEach((param) => {
        let keyValue = param.split('=')
        routeInfo['query'][keyValue[0]] = keyValue[1]
      })
    }
    let fromPath
    if (this.currentRoute) fromPath = this.currentRoute
    else fromPath = null
    await this.beforeEachRoute(this.beforeEach, routeInfo, fromPath)
    this.currentRoute = routeInfo
    this.compareRoutes()
    if (this.afterEach) this.afterEach(routeInfo, fromPath)
  }

  async parseHistory (event) {
    let path = event.detail.path
    let detailObj = { path: path }
    history.pushState(detailObj, '', path)
    var routeArray = path.split('?')
    var routeInfo = {}
    routeInfo['fullPath'] = routeArray[0]
    routeInfo['route'] = routeArray[0].split('/')
    routeInfo['query'] = {}
    if (routeArray[1]) {
      var routeQuery = routeArray[1].split('&')
      routeQuery.forEach((param) => {
        let keyValue = param.split('=')
        routeInfo['query'][keyValue[0]] = keyValue[1]
      })
    }
    let fromPath
    if (this.currentRoute) fromPath = this.currentRoute
    else fromPath = null
    await this.beforeEachRoute(this.beforeEach, routeInfo, fromPath)
    this.currentRoute = routeInfo
    this.compareRoutes()
    if (this.afterEach) this.afterEach(routeInfo, fromPath)
  }

  push (url) {
    if (this.mode === 'hash') window.location.hash = url
    if (this.mode === 'history') {
      let stateObj = { path: url }
      var event = new CustomEvent('svelteEasyrouteLinkClicked',
        {
          'detail': stateObj
        })
      window.dispatchEvent(event)
    }
  }

  get getCurrentRoute () {
    return this.currentRoute
  }
}

export { Router }
