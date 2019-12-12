import IRouterParams from "./interfaces/IRouterParams";
import IRouter from "./interfaces/IRouter";
import IRoute from "./interfaces/IRoute";
import IRouteInfo from "./interfaces/IRouteInfo";
import IRouteComplexData from "./interfaces/IRouteComplexData";

import {RouterException} from "./exceptions/RouterException";

import PathService from "./services/PathService";
import HashBasedRouting from "./services/HashBasedRouting";
import UrlParser from "./services/UrlParser";
import CssTransitionService from "./services/CssTransitionService";

const ROUTER_MODES : string[] = [
    "hash",
    "history",
    "silent"
];

export default class Router implements IRouter {

    private pathService : PathService = new PathService();
    private urlParser : UrlParser = new UrlParser();
    private parser !: HashBasedRouting;
    private transitionService : CssTransitionService | null;

    public mode : string = "hash";
    public baseUrl : string = "/";
    public routes : IRoute[];
    public afterUpdate : Function | undefined;
    public beforeEach : Function | undefined;
    public afterEach : Function | undefined;
    public currentRoute : IRouteComplexData | undefined;
    public previousRoute : IRouteComplexData | undefined;
    public routeInfo : IRouteInfo | undefined;
    public fullUrl : string = "/";

    constructor(
        params: IRouterParams
    ) {
        Router.validateParameters(params);
        this.mode = params.mode || "hash";
        this.baseUrl = Router.formatBaseUrl(params.base);
        this.routes = this.pathService.getPathInformation(params.routes);
        this.beforeEach = params.beforeEach;

        if (params.transition) {
            this.transitionService = new CssTransitionService(params.transition);
        } else {
            this.transitionService = null;
        }

        this.setParser();
    }

    private static validateParameters (
        params: IRouterParams
    ) : void {
        if (!params || typeof params !== "object") {
            throw new RouterException("Wrong parameters object format!");
        }

        if (!ROUTER_MODES.includes(params.mode as string)) {
            console.warn(`Easyroute: router "mode" is not selected. You should choose one of this: ${ROUTER_MODES.join(", ")}. Auto-selected: "hash".`);
            params.mode = "hash";
        }
    }

    private static formatBaseUrl (
        baseUrl : string | undefined
    ) : string {
        if (!baseUrl) return "/";
        if (baseUrl.length) {
            if (baseUrl[0] !== "/") baseUrl = `/${baseUrl}`;
            if (baseUrl[baseUrl.length - 1] !== "/") baseUrl = `${baseUrl}/`;
        }
        return baseUrl;
    }

    private setParser () {
        if (this.mode === "hash") {
            this.parser = new HashBasedRouting(this.routes);
            this.parseRoute(window.location.hash.replace("#",""));
            window.addEventListener("hashchange", () => {
                this.parseRoute(window.location.hash.replace("#",""));
            });
        }
        // if (this.baseUrl) this.parseRoute(this.baseUrl);
    }

    public parseRoute (
        url : string
    ) {
        const [ path, query ] = url.split('?');
        let matchedRoute : IRoute | null = this.parser.parse(path);
        if (!matchedRoute) {
            console.warn(`Easyroute :: no routes matched "${url}"`);
            return;
        }
        this.routeInfo = this.urlParser.createRouteObject(matchedRoute, path, query, url);
        this.previousRoute =  this.currentRoute ? JSON.parse(JSON.stringify(this.currentRoute)) : undefined;
        this.currentRoute = {
            routeObject: matchedRoute,
            routeInfo: this.routeInfo
        };
        this.fireNavigation();
    }

    private _beforeEach
    (
        to : IRouteComplexData | undefined,
        from : IRouteComplexData | undefined
    ) {
        return new Promise((resolve) => {
            if (!this.beforeEach) resolve();
            this.beforeEach!(to, from, resolve);
        });
    }

    private _afterEach
    (
        to : IRouteComplexData | undefined,
        from : IRouteComplexData | undefined
    ) {
        if (!this.afterEach) return;
        this.afterEach(to, from);
    }

    private async fireNavigation () {
        if (this.transitionService) this.transitionService.transitionIn();
        setTimeout(async () => {
            await this._beforeEach(this.currentRoute, this.previousRoute);
            if (this.afterUpdate) this.afterUpdate();
            this._afterEach(this.currentRoute, this.previousRoute);
        }, this.transitionService!.enteringDuration);
    }

}
