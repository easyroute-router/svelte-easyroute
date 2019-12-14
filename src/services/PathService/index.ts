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

    private parsePaths (
        routes: IRoute[]
    ) : IRoute[] {
        let allRoutes: IRoute[] = [];
        const recursive = (routesArray: IRoute[],
            parentPath : string = "",
            nestingDepth : number = 0) =>
        {
            routesArray.forEach((el) => {
                if (parentPath.length) {
                    parentPath = parentPath.replace(/\*/g,"");
                    let elPath = el.path;
                    if (elPath[0] !== "/") elPath = `/${elPath}`;
                    el.path = parentPath + elPath;
                    el.nestingDepth = nestingDepth
                } else {
                    el.nestingDepth = nestingDepth;
                }
                allRoutes.push(el);
                if (el.children && el.children.length) {
                    recursive(el.children, el.path, nestingDepth + 1);
                }
            });
        };
        recursive(routes);
        return allRoutes;
    }

    public getPathInformation (
        routes: IRoute[]
    ) : IRoute[] {
        let allRoutes : IRoute[] = this.parsePaths(routes);
        console.log(allRoutes);
        return allRoutes.map(route => {
            let keysArray: Key[] = [];
            route.regexpPath = this.pathToRegexp(route.path, keysArray);
            route.pathKeys = keysArray;
            return route;
        });
    }
}
