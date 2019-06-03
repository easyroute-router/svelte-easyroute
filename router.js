import RouterOutlet from "./RouterOutlet.svelte" // rollup
import RouterOutlet from "!!svelte-loader!./RouterOutlet.svelte" // webpack

class Router {
  constructor (routes) {
    this.routes = routes.routes
    this.currentRouteComponent = routes.main
    this.afterUpdate = routes.callback
    window.onhashchange = this.parseHash.bind(this)
  }

  createOutlet () {
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

  push (url) {
    window.location.hash = url
  }

  get getCurrentRoute () {
    return this.currentRoute
  }
}

export { Router }
