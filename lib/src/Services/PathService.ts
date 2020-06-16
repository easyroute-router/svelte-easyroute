import { pathToRegexp } from 'path-to-regexp'
import queryString from 'query-string'
import { Route } from "../Router/types";
import generateId from "../Utils/IdGenerator";

export default class PathService {

    private readonly pathToRegexp : any = pathToRegexp;
    private readonly queryString : any = queryString;

    private parsePaths (
        routes: Route[]
    ) : Route[] {
        let allRoutes: Route[] = [];
        const recursive = (routesArray: Route[],
                           parentPath : string = "",
                           nestingDepth : number = 0,
                           parentId: string | null = null) =>
        {
            routesArray.forEach((el) => {
                if (parentPath.length) {
                    parentPath = parentPath.replace(/\*/g,"");
                    let elPath = el.path;
                    if (elPath != null && elPath[0] !== "/") elPath = `/${elPath}`;
                    el.path = (parentPath[parentPath.length - 1] !== '/' ? parentPath: '') + elPath;
                    el.nestingDepth = nestingDepth
                } else {
                    el.nestingDepth = nestingDepth;
                }
                el.parentId = parentId
                el.id = generateId()
                allRoutes.push(el);
                if (el.children && el.children.length) {
                    recursive(el.children, el.path, nestingDepth + 1, el.id);
                }
            });
        };
        recursive(routes);
        return allRoutes;
    }

    public getPathInformation (
        routes: Route[]
    ) : Route[] {
        let allRoutes : Route[] = this.parsePaths(routes);
        return allRoutes.map(route => {
            let keysArray: any[] = [];
            route.regexpPath = this.pathToRegexp(route.path, keysArray);
            route.pathKeys = keysArray;
            return route;
        });
    }
}