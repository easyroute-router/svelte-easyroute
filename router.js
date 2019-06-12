var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// @ts-ignore
import RouterOutlet from "!!svelte-loader!./RouterOutlet.svelte"; // webpack
// @ts-ignore
import RouterOutlet from './RouterOutlet.svelte' // rollup
class Router {
    /**
     * Easyroute constructor
     * @param params
     */
    constructor(params) {
        this.mode = "hash";
        this.baseUrl = "";
        if (!params || typeof params != "object") {
            throw Error('Wrong parameters given to Router constructor');
        }
        if (params.mode !== "history" && params.mode !== "hash") {
            console.warn('SVELTE EASYROUTE: Router "mode" is not set: should be "hash" or "history".\nAuto-setting: "hash"');
        }
        else {
            this.mode = params.mode;
        }
        window["routermode"] = this.mode;
        if (params.base) {
            var base = params.base;
            if (base !== "") {
                if (base[0] !== "/")
                    base = "/" + base;
                if (base[base.length - 1] !== "/")
                    base = base + "/";
            }
            this.baseUrl = base;
        }
        this.routes = params.routes;
        this.afterUpdate = params.callback;
        if (!params.beforeEach) {
            this.beforeEach = null;
        }
        else {
            this.beforeEach = params.beforeEach;
        }
        if (this.mode === "hash") {
            window.onhashchange = this.parseHash.bind(this);
        }
        if (this.mode === "history") {
            window.addEventListener('svelteEasyrouteLinkClicked', function (event) {
                this.parseHistory(event);
            }.bind(this));
            window.addEventListener("popstate", function (event) {
                this.historyPopState(event);
            }.bind(this));
        }
    }
    historyPopState(event) {
        let fakeEvent = {
            detail: {
                path: event.state.path
            }
        };
        this.parseHistory(fakeEvent, false);
    }
    parseHash() {
        return __awaiter(this, void 0, void 0, function* () {
            if (window.location.hash.indexOf('#') === -1) {
                this.push('/');
            }
            let hash = window.location.hash.replace('#', '');
            var routeArray = hash.split('?');
            var routeInfo;
            var routeInfo = {
                fullPath: routeArray[0],
                route: routeArray[0].split('/'),
                query: {}
            };
            if (routeArray[1]) {
                var routeQuery = routeArray[1].split('&');
                routeQuery.forEach((param) => {
                    let keyValue = param.split('=');
                    routeInfo.query[keyValue[0]] = keyValue[1];
                });
            }
            var fromPath;
            if (this.currentRoute)
                fromPath = this.currentRoute;
            else
                fromPath = null;
            yield this.beforeEachRoute(this.beforeEach, routeInfo, fromPath);
            this.currentRoute = routeInfo;
            this.compareRoutes();
            if (this.afterEach)
                this.afterEach(routeInfo, fromPath);
        });
    }
    parseHistory(event, doPushState = true) {
        return __awaiter(this, void 0, void 0, function* () {
            if (event.detail.needAddBase && this.baseUrl.length) {
                let evPath = event.detail.path;
                if (evPath[0] === "/")
                    evPath = evPath.substring(1);
                evPath = this.baseUrl + evPath;
                event.detail.path = evPath;
            }
            if (event.detail.path.indexOf(this.baseUrl) == -1 && doPushState !== false)
                return false;
            let path = event.detail.path.replace(this.baseUrl, "");
            if (path[0] !== "/")
                path = "/" + path;
            this.fullUrl = path;
            let detailObj = { path: path };
            if (doPushState)
                history.pushState(detailObj, '', event.detail.path);
            var routeArray = path.split('?');
            var routeInfo = {
                fullPath: routeArray[0],
                route: routeArray[0].split('/'),
                query: {}
            };
            if (routeArray[1]) {
                var routeQuery = routeArray[1].split('&');
                routeQuery.forEach((param) => {
                    let keyValue = param.split('=');
                    routeInfo.query[keyValue[0]] = keyValue[1];
                });
            }
            var fromPath;
            if (this.currentRoute)
                fromPath = this.currentRoute;
            else
                fromPath = null;
            yield this.beforeEachRoute(this.beforeEach, routeInfo, fromPath);
            this.currentRoute = routeInfo;
            this.compareRoutes();
            if (this.afterEach)
                this.afterEach(routeInfo, fromPath);
        });
    }
    createOutlet() {
        let outletDiv = document.getElementById('router-outlet');
        if (!outletDiv)
            throw Error('Could not find element with id "router-outlet". Router NOT created...');
        let outlet = new RouterOutlet({
            target: document.getElementById('router-outlet'),
            props: {
                router: this
            }
        });
        if (this.mode === 'hash')
            this.parseHash();
        if (this.mode === 'history')
            this.initHistoryMode();
        return outlet;
    }
    beforeEachRoute(userFunc, to, from) {
        return new Promise((resolve, reject) => {
            if (!userFunc)
                resolve();
            userFunc(to, from, resolve);
        });
    }
    parseParametedRoute(url) {
        var nBread = url.split('/');
        var matched = {};
        for (var i = 0; i < this.routes.length; i++) {
            var route = this.routes[i];
            var routePath = route.path;
            var rBread = routePath.split('/');
            if (rBread.length !== nBread.length)
                continue;
            var routeParams = {};
            matched[`${route.path}`] = true;
            for (var j = 0; j < rBread.length; j++) {
                var el = rBread[j];
                if (nBread[j] === '' && j !== 0) {
                    matched[`${route.path}`] = false;
                    continue;
                }
                if (el === nBread[j])
                    continue;
                else {
                    if (el[0] === ':') {
                        routeParams[el.replace(':', '')] = nBread[j];
                        continue;
                    }
                    else {
                        matched[`${route.path}`] = false;
                    }
                }
            }
        }
        let keys = Object.keys(matched).filter((key) => matched[key] === true);
        if (!keys.length)
            throw Error("Couldn't find matching path");
        else {
            let idx = this.routes.findIndex((r) => r.path === keys[0]);
            this.currentRoute['params'] = routeParams;
            return idx;
        }
    }
    compareRoutes() {
        let routeStringUrl = this.currentRoute.route;
        var routeString = routeStringUrl.join('/');
        if (routeString[routeString.length - 1] === '/' && routeString !== '/')
            routeString = routeString.slice(0, -1);
        var routeIdx = this.routes.findIndex((r) => r.path === routeString);
        if (routeIdx === -1) {
            try {
                routeIdx = this.parseParametedRoute(routeString);
            }
            catch (error) {
                routeIdx = -1;
            }
        }
        this.afterUpdate(routeIdx);
    }
    initHistoryMode() {
        let url = window.location.pathname + window.location.search;
        let stateObj = { path: url, needAddBase: false };
        var event = new CustomEvent('svelteEasyrouteLinkClicked', {
            'detail': stateObj
        });
        window.dispatchEvent(event);
    }
    push(url) {
        if (this.mode === 'hash')
            window.location.hash = url;
        if (this.mode === 'history') {
            let stateObj = { path: url };
            var event = new CustomEvent('svelteEasyrouteLinkClicked', {
                'detail': stateObj
            });
            window.dispatchEvent(event);
        }
    }
    pushByName(name) {
        let matched = this.routes.filter((route) => route.name === name);
        if (!matched.length) {
            throw Error('Route with name "' + name + '" not found');
        }
        let url = matched[0].path;
        this.push(url);
    }
    get getCurrentRoute() {
        return this.currentRoute;
    }
}
export { Router };
//# sourceMappingURL=router.js.map