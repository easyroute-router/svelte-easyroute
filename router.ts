interface RouterRoute {
    path: String,
    component: Function,
    name: String
}

interface RouterParams {
    mode: String,
    routes: Array<RouterRoute>,
    afterUpdate: Function,
    beforeEach: Function,
    afterEach: Function,
    callback: Function,
    base: String
}

interface RouteInfo {
    fullPath: string,
    route: Array<String>,
    query: Object
}

// @ts-ignore
//import RouterOutlet from "!!svelte-loader!./RouterOutlet.svelte" // webpack
// @ts-ignore
import RouterOutlet from "./RouterOutlet.svelte" // rollup

class Router {

    mode: String = "hash";
    routes: Array<RouterRoute>;
    afterUpdate: Function;
    beforeEach: Function;
    afterEach: Function;
    currentRoute: RouteInfo;
    fullUrl: String;
    baseUrl: String = "";
    silentModeHistory: Array<String> = [];
    silentModeIdx: number = -1;

    /**
     * Easyroute constructor
     * @param params 
     */
    constructor(params: RouterParams) {

        if (!params || typeof params != "object") {
            throw Error('Wrong parameters given to Router constructor');
        }
        if (params.mode !== "history" && params.mode !== "hash" && params.mode !== "silent") {
            console.warn('SVELTE EASYROUTE: Router "mode" is not set: should be "hash", "history" or "silent".\nAuto-setting: "hash"');
        }
        else {
            this.mode = params.mode;
        } 
        window["routermode"] = this.mode;

        if (params.base) {
            var base = params.base;
            if (base !== "") {
                if (base[0] !== "/") base = "/" + base;
                if (base[base.length-1] !== "/") base = base + "/";
            }
            this.baseUrl = base;
        }
        this.routes = params.routes;
        this.afterUpdate = params.callback;

        if (!params.beforeEach) {
            this.beforeEach = null;
        } else {
            this.beforeEach = params.beforeEach;
        }

        if (this.mode === "hash") {
            window.onhashchange = this.parseHash.bind(this);
        }
        if (this.mode === "history") {
            window.addEventListener('svelteEasyrouteLinkClicked', function (event) {
                this.parseHistory(event);
            }.bind(this));
            window.addEventListener("popstate",function(event) {
                this.historyPopState(event)
            }.bind(this));
        }
        if (this.mode === "silent") {
            this.parseSilent({
                detail: {
                    path: "/",
                    needAddBase: true
                }
            })
            window.addEventListener('svelteEasyrouteSilentNavigated',function(event) {
                this.parseSilent(event);
            }.bind(this))
        }
    }

    /**
     * historyPopState - what happens when we navigate
     * in browser's history via browser's "back" and 
     * "forward" buttons
     * @param event 
     */
    historyPopState(event) {
        let fakeEvent = {
            detail: {
                path: event.state.path
            }
        };
        this.parseHistory(fakeEvent,false);
    }

    /**
     * parseHash - parsing location hash to navigate
     * in "hash" mode.
     */
    parseHash() {
        if (window.location.hash.indexOf('#') === -1) {
            this.push('/');
        }
        let hash = window.location.hash.replace('#', '');
        var routeArray = hash.split('?');
        var routeInfo: RouteInfo;
        var routeInfo: RouteInfo = {
            fullPath: routeArray[0],
            route: routeArray[0].split('/'),
            query: {}
        };
        if (routeArray[1]) {
            var routeQuery = routeArray[1].split('&');
            routeQuery.forEach((param) => {
              let keyValue = param.split('=')
              routeInfo.query[keyValue[0]] = keyValue[1]
            })
        }
        var fromPath: RouteInfo;
        if (this.currentRoute) fromPath = this.currentRoute;
        else fromPath = null;

        this.beforeEachRoute(this.beforeEach,routeInfo,fromPath).then(function(r){
            this.currentRoute = routeInfo;
            this.compareRoutes();
            if (this.afterEach) this.afterEach(routeInfo, fromPath);
        }.bind(this))
    }

    /**
     * parseHistory - parsing url to navigate
     * in "history" mode. 
     * @param event - event object (from links and etc.) 
     * @param doPushState - boolean, tells us if we should fire pushState in history
     */
    parseHistory(event,doPushState: boolean = true) {
        if (event.detail.needAddBase && this.baseUrl.length) {
            let evPath = event.detail.path;
            if (evPath[0] === "/") evPath = evPath.substring(1);
            evPath = this.baseUrl + evPath;
            event.detail.path = evPath;
        }
        if (event.detail.path.indexOf(this.baseUrl) == -1 && doPushState !== false) return false;
        let path = event.detail.path.replace(this.baseUrl,"");
        if (path[0] !== "/") path = "/"+path;
        this.fullUrl = path;
        let detailObj = { path: path };
        if (doPushState) history.pushState(detailObj, '', event.detail.path)
        var routeArray = path.split('?');
        var routeInfo: RouteInfo = {
            fullPath: routeArray[0],
            route: routeArray[0].split('/'),
            query: {}
        };
        if (routeArray[1]) {
            var routeQuery = routeArray[1].split('&');
            routeQuery.forEach((param) => {
              let keyValue = param.split('=')
              routeInfo.query[keyValue[0]] = keyValue[1]
            })
        }
        var fromPath: RouteInfo;
        if (this.currentRoute) fromPath = this.currentRoute;
        else fromPath = null;

        this.beforeEachRoute(this.beforeEach,routeInfo,fromPath).then(function() {
            this.currentRoute = routeInfo;
            this.compareRoutes();
            if (this.afterEach) this.afterEach(routeInfo, fromPath);
        }.bind(this))
    }

    /**
     * parseSilent - parsing address in silent mode
     * @param event - event object
     */
    parseSilent(event) {
        if (event.detail.needAddBase && this.baseUrl.length) {
            let evPath = event.detail.path;
            if (evPath[0] === "/") evPath = evPath.substring(1);
            evPath = this.baseUrl + evPath;
            event.detail.path = evPath;
        }
        if (event.detail.path.indexOf(this.baseUrl) == -1) return false;
        let path = event.detail.path.replace(this.baseUrl,"");
        if (path[0] !== "/") path = "/"+path;
        this.fullUrl = path;
        var routeArray = path.split('?');
        var routeInfo: RouteInfo = {
            fullPath: routeArray[0],
            route: routeArray[0].split('/'),
            query: {}
        };
        if (routeArray[1]) {
            var routeQuery = routeArray[1].split('&');
            routeQuery.forEach((param) => {
              let keyValue = param.split('=')
              routeInfo.query[keyValue[0]] = keyValue[1]
            })
        }
        var fromPath: RouteInfo;
        if (this.currentRoute) fromPath = this.currentRoute;
        else fromPath = null;
        this.beforeEachRoute(this.beforeEach,routeInfo,fromPath).then(function() {
            this.currentRoute = routeInfo;
            this.compareRoutes();
            if (!event.detail.backAction) {
                this.silentModeHistory.push(event.detail.path);
                this.silentModeIdx++;
            }
            if (this.afterEach) this.afterEach(routeInfo, fromPath);
        }.bind(this))
    }

    silentGoBack() {
        if (this.mode !== "silent") return false;
        if (this.silentModeIdx < 1) return false;
        this.silentModeIdx--;
        this.push(this.silentModeHistory[this.silentModeIdx],true)
    }

    silentGoForward() {
        if (this.mode !== "silent") return false;
        if (this.silentModeIdx === this.silentModeHistory.length - 1) return false;
        this.silentModeIdx++;
        this.push(this.silentModeHistory[this.silentModeIdx],true)
    }

    /**
     * createOutlet - creating RouterOutlet
     */
    createOutlet () {
        let outletDiv = document.getElementById('router-outlet');
        if (!outletDiv) throw Error('Could not find element with id "router-outlet". Router NOT created...');
        let outlet = new RouterOutlet({
          target: document.getElementById('router-outlet'),
          props: {
            router: this
          }
        });
        if (this.mode === 'hash') this.parseHash();
        if (this.mode === 'history') this.initHistoryMode();
        return outlet;
    }

    /**
     * beforeEachRoute - wrapper function for user-specified
     * "beforeEach" method
     * @param userFunc 
     * @param to 
     * @param from 
     */
    beforeEachRoute(userFunc,to,from) {
        return new Promise((resolve, reject) => {
            if (!userFunc) resolve();
            userFunc(to, from, resolve);
        })
    }

    /**
     * parseParametedRoute - looking for ":" parts in path
     * for dynamic routes matching
     * @param url 
     */
    parseParametedRoute (url) {
        var nBread = url.split('/');
        var matched = {};
        for (var i = 0; i < this.routes.length; i++) {
          var route = this.routes[i];
          var routePath = route.path;
          var rBread = routePath.split('/');
          if (rBread.length !== nBread.length) continue;
          var routeParams = {};
          matched[`${route.path}`] = true;
          for (var j = 0; j < rBread.length; j++) {
            var el = rBread[j];
            if (nBread[j] === '' && j !== 0) {
              matched[`${route.path}`] = false;
              continue;
            }
            if (el === nBread[j]) continue;
            else {
              if (el[0] === ':') {
                routeParams[el.replace(':', '')] = nBread[j];
                continue;
              } else {
                matched[`${route.path}`] = false;
              }
            }
          }
        }
        let keys = Object.keys(matched).filter((key) => matched[key] === true);
        if (!keys.length) throw Error("Couldn't find matching path");
        else {
          let idx = this.routes.findIndex((r) => r.path === keys[0]);
          this.currentRoute['params'] = routeParams;
          return idx;
        }
    }

    /**
     * parseDefaultRoute - looking for "*" last parts in path
     * for any route matching
     * @param url 
     */
    parseDefaultRoute(url: String) : number {
        if (url.trim() === '/') throw Error('Url is index!');
        if (url[url.length-1] === '/') url = url.slice(0,-1);
        if (url[0] === '/') url = url.slice(1,url.length);
        var indexAnyRoute: number = -1;
        for (var i = 0; i < this.routes.length; i++) {
            let route = this.routes[i];
            let routePath = route.path;
            if (routePath.trim() === '*') indexAnyRoute = i;
            if (routePath.trim() === '/') continue;
            if (routePath[routePath.length-1] === '/') routePath = routePath.slice(0,-1);
            if (routePath[0] === '/') routePath = routePath.slice(1,routePath.length);
            var rBread = routePath.split('/');
            var urlBread = url.split('/');
            if (rBread.length !== urlBread.length) continue;
            for (let k = 0; k < urlBread.length; k++) {
                if (urlBread[k] === rBread[k] && k < urlBread.length - 1) continue;
                else if (urlBread[k] !== rBread[k] && k < urlBread.length - 1) break;
                else {
                    if (k === urlBread.length-1 && rBread[k].trim() === '*') {
                        return i
                    }
                }
            }
        }
        if (indexAnyRoute !== -1) return indexAnyRoute
        throw Error('Test')
    }

    /**
     * compareRoutes = the method where we passing
     * new route index to outlet.
     */
    compareRoutes() {
        let routeStringUrl = this.currentRoute.route;
        var routeString = routeStringUrl.join('/');
        if (routeString[routeString.length - 1] === '/' && routeString !== '/') routeString = routeString.slice(0, -1);
        var routeIdx = this.routes.findIndex((r) => r.path === routeString);
        if (routeIdx === -1) {
            try {
                routeIdx = this.parseParametedRoute(routeString);
            } catch (error) {
                try {
                    routeIdx = this.parseDefaultRoute(routeString);
                } catch (error) {
                    routeIdx = -1;
                }
            }
        }
        this.afterUpdate(routeIdx)
    }

    /**
     * initHistoryMode - first called after router
     * creating with mode "history"
     */
    initHistoryMode() {
        let url = window.location.pathname + window.location.search;
        let stateObj = { path: url, needAddBase: false };
        var event = new CustomEvent('svelteEasyrouteLinkClicked',
        {
            'detail': stateObj
        });
        window.dispatchEvent(event);
    }

    /**
     * push - Navigation method
     * @param url - string
     */
    push(url, backAction: boolean = false) {
        if (this.mode === 'hash') window.location.hash = url;
        if (this.mode === 'history') {
            let stateObj = { path: url };
            let event = new CustomEvent('svelteEasyrouteLinkClicked',
                {
                'detail': stateObj
                });
            window.dispatchEvent(event);
        }
        if (this.mode === 'silent') {
            let stateObj = { path: url, backAction };
            let event = new CustomEvent('svelteEasyrouteSilentNavigated',
                {
                'detail': stateObj
                });
            window.dispatchEvent(event);
        }
    }

    /**
     * pushByName - navigation between routes
     * by route name.
     * @param name 
     */
    pushByName (name) {
        let matched = this.routes.filter((route) => route.name === name);
        if (!matched.length) {
            throw Error('Route with name "' + name + '" not found');
        }
        let url = matched[0].path;
        this.push(url);
    }

    get getCurrentRoute () {
        return this.currentRoute
    }
}

export { Router }