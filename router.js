import RouterOutlet from "./RouterOutlet.svelte" // rollup
import RouterOutlet from "!!svelte-loader!./RouterOutlet.svelte" // webpack

class Router {

  constructor (params) {
    var routes = params
    if (!routes || typeof routes != 'object') {
      throw Error('Wrong parameters given to Router constructor')
    }
    if (routes.mode != "history" && routes.mode != "hash") {
      throw Error("Wrong router mode. Allowed only 'hash' or 'history'")
    }
    this.mode = routes.mode
    this.routes = routes.routes
    this.currentRouteComponent = routes.main
    this.afterUpdate = routes.callback
    window.routermode = this.mode
    if (this.mode == 'hash') window.onhashchange = this.parseHash.bind(this)
    if (this.mode == 'history') {
      var self = this
      window.addEventListener('svelteEasyrouteLinkClicked',function(event) {
        self.parseHistory(event)
      })
      window.onpopstate = function(event) {
        self.initHistoryMode()
      }
    }
  }

  createOutlet () {
    let outletDiv = document.getElementById('router-outlet')
    if (!outletDiv) {
      console.error('Could not find element with id "router-outlet". Router NOT created...')
      return false
    }
    let outlet = new RouterOutlet({
      target: document.getElementById('router-outlet'),
      props: {
        router: this
      }
    })
    if (this.mode == 'hash') this.parseHash()
    if (this.mode == 'history') this.initHistoryMode()
    return outlet
  }

  compareRoutes () {
    let routeString = this.currentRoute.route
    routeString = routeString.join('/')
    let routeIdx = this.routes.findIndex((r) => r.path === routeString)
    this.afterUpdate(routeIdx)
  }

  initHistoryMode() {
    let url = window.location.pathname + window.location.search
    let stateObj = { path: url };
    var event = new CustomEvent('svelteEasyrouteLinkClicked', 
                { 
                    'detail': stateObj 
                });
            window.dispatchEvent(event)
  }

  parseHash () {
      if (window.location.hash.indexOf('#') == -1) {
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
      this.currentRoute = routeInfo
      this.compareRoutes()
  }

  parseHistory(event) {
    let path = event.detail.path
    let detailObj = {path: path}
    history.pushState(detailObj,"",path)
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
    this.currentRoute = routeInfo
    this.compareRoutes()
  }

  push (url) {
    if (this.mode == 'hash') window.location.hash = url
    if (this.mode == 'history') {
      let stateObj = { path: url };
      var event = new CustomEvent('svelteEasyrouteLinkClicked', 
                { 
                    'detail': stateObj 
                });
            window.dispatchEvent(event)
    }
  }

  get getCurrentRoute () {
    return this.currentRoute
  }
}

export { Router }
