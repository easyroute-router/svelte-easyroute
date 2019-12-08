import IRouterParams from "./interfaces/IRouterParams";
import IRouter from "./interfaces/IRouter";
import IRoute from "./interfaces/IRoute";

import { RouterException } from "./exceptions/RouterException";

import PathService from "./services/PathService";
import HashBasedRouting from "./services/HashBasedRouting";

const ROUTER_MODES : string[] = [
    "hash",
    "history",
    "silent"
];

export default class Router implements IRouter {

    private pathService : PathService = new PathService();
    private parser !: HashBasedRouting;

    public mode : string = "hash";
    public baseUrl : string = "/";
    public routes : IRoute[];
    public afterUpdate : Function | undefined;
    public beforeEach : Function | undefined;
    public afterEach : Function | undefined;
    public currentRoute : IRoute | undefined;
    public fullUrl : string = "/";

    constructor(
        params: IRouterParams
    ) {
        Router.validateParameters(params);
        this.mode = params.mode || "hash";
        this.baseUrl = Router.formatBaseUrl(params.base);
        this.routes = this.pathService.getPathInformation(params.routes);
        this.afterUpdate = params.afterUpdate;
        this.beforeEach = params.beforeEach;
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
            // window.addEventListener("hashchange", () => {
            //     this.parseRoute(window.location.hash);
            // });
        }
    }

    public parseRoute (
        url : string
    ) {
        let matchedRoute : IRoute | null = this.parser.parse(url);
        if (!matchedRoute) {
            console.warn(`Easyroute :: no routes matched "${url}"`);
            return;
        }
        let pathValues = matchedRoute.regexpPath!.exec(url) as string[];
        pathValues = pathValues.slice(1, pathValues.length);
        let urlParams : { [key : string] : string} = {};
        for (let pathPart in pathValues) {
            let value = pathValues[pathPart];
            let key = matchedRoute.pathKeys![pathPart].name;
            urlParams[key] = value;
        }
    }

}
