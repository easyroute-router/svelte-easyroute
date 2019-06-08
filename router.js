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
  /**
   * Router constructor. Requires an array of routes.
   * Each route should be defined as na object with required keys:
   * 1) "path": String == a part of url after a domain name;
   * 2) "component": SvelteComponent == imported Svelte component;
   * 3) "name": String == name of the route
   * @param {Object} params
   */
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

  /**
   * befoureEachRoute - hook before router changes component.
   * @param {Function} userFunc
   * @param {String} to
   * @param {String} from
   */
  beforeEachRoute (userFunc, to, from) {
    return new Promise((resolve, reject) => {
      if (!userFunc) resolve()
      userFunc(to, from, resolve)
    })
  }

  /**
   * Router outlet creation. Creates outlet inside container with id = "router-outlet"
   */
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

  /**
   * parseParametedRoute - trying to find matching route
   * when we are pretty sure that we have rotue with
   * parameter
   * @param {*} url
   */
  parseParametedRoute (url) {
    var nBread = url.split('/')
    var matched = {}
    for (var i = 0; i < this.routes.length; i++) {
      var route = this.routes[i]
      var routePath = route.path
      var rBread = routePath.split('/')
      if (rBread.length !== nBread.length) continue
      var routeParams = {}
      matched[route.path] = true
      for (var j = 0; j < rBread.length; j++) {
        var el = rBread[j]
        if (nBread[j] === '' && j !== 0) {
          matched[route.path] = false
          continue
        }
        if (el === nBread[j]) continue
        else {
          if (el[0] === ':') {
            routeParams[el.replace(':', '')] = nBread[j]
            continue
          } else {
            matched[route.path] = false
          }
        }
      }
    }
    let keys = Object.keys(matched).filter((key) => matched[key] === true)
    if (!keys.length) throw Error("Couldn't find matching path")
    else {
      let idx = this.routes.findIndex((r) => r.path === keys[0])
      this.currentRoute['params'] = routeParams
      return idx
    }
  }

  /**
   * compareRoutes - resulting function; finds an index of the route
   * and sends it to the RouterOutlet
   */
  compareRoutes () {
    var routeString = this.currentRoute.route
    routeString = routeString.join('/')
    if (routeString[routeString.length - 1] === '/' && routeString !== '/') routeString = routeString.slice(0, -1)
    var routeIdx = this.routes.findIndex((r) => r.path === routeString)
    if (routeIdx === -1) {
      try {
        routeIdx = this.parseParametedRoute(routeString)
      } catch (error) {
        routeIdx = -1
      }
    }
    this.afterUpdate(routeIdx)
  }

  /**
   * initHistoryMode - checking initial URL in
   * History mode
   */
  initHistoryMode () {
    let url = window.location.pathname + window.location.search
    let stateObj = { path: url }
    var event = new CustomEvent('svelteEasyrouteLinkClicked',
      {
        'detail': stateObj
      })
    window.dispatchEvent(event)
  }

  /**
   * parseHash - reacting on window.location.hash change
   * mode: hash
   */
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

  /**
   * parseHistory - reacting on url change in history mode.
   * Event-based, mode:history.
   * @param {Event} event
   */
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

  /**
   * Push page url to passed url (string)
   * @param {String} url
   */
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

  /**
   * Navigate between routes by name
   * @param {String} name
   */
  pushByName (name) {
    let matched = this.routes.filter((route) => route.name === name)
    if (!matched.length) {
      throw Error('Route with name "' + name + '" not found')
    }
    let url = matched[0].path
    this.push(url)
  }

  get getCurrentRoute () {
    return this.currentRoute
  }
}

export { Router }
