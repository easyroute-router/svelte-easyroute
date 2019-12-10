/**
 *
 * Svelte Easyroute 2
 *
 * Path service
 *
 * uses "path-to-regexp"
 * https://github.com/pillarjs/path-to-regexp
 */

import {Key} from "path-to-regexp";
import pathToRegexp from "path-to-regexp";
import IRoute from "../../interfaces/IRoute";
import queryString from "query-string";

export default class PathService {

    private readonly pathToRegexp : any = pathToRegexp;
    private readonly queryString : any = queryString;

    constructor() {
    }

    public getPathInformation (
        routes: IRoute[]
    ) : IRoute[] {
        return routes.map(route => {
            let keysArray: Key[] = [];
            route.regexpPath = this.pathToRegexp(route.path, keysArray);
            route.pathKeys = keysArray;
            return route;
        });
    }
}
