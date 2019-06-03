import RouterOutlet from "./RouterOutlet.svelte" // rollup
import RouterOutlet from "!!svelte-loader!./RouterOutlet.svelte" // webpack

class Router {

  constructor (routes) {
    if (!routes || typeof routes != 'object') {
      console.error('Wrong parameters given to Router constructor')
      return false
    }
    this.mode = 'hash' // TODO: add 'history' mode
    this.routes = routes.routes
    this.currentRouteComponent = routes.main
    this.afterUpdate = routes.callback
    if (this.mode == 'hash') window.onhashchange = this.parseHash.bind(this)
    if (this.mode == 'history') window.onpopstate = this.parseHash.bind(this)
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
    this.parseHash()
    return outlet
  }

  compareRoutes () {
    let routeString = this.currentRoute.route
    routeString = routeString.join('/')
    let routeIdx = this.routes.findIndex((r) => r.path === routeString)
    this.afterUpdate(routeIdx)
  }

  parseHash () {
    if (this.mode == 'hash') {
      if (window.location.hash == "") {
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
    else if (this.mode == 'history') {
      if (history.state == null) {
        this.push('/')
      }
      console.log(history.state)
    }
  }

  push (url) {
    if (this.mode == 'hash') window.location.hash = url
    if (this.mode == 'history') {
      let stateObj = { path: "/" };
      history.pushState(stateObj, "", "/");
    }
  }

  get getCurrentRoute () {
    return this.currentRoute
  }
}

export { Router }
