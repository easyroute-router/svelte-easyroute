import IRoute from "../../interfaces/IRoute";
import IMatchedRoute from "../../interfaces/IMatchedRoute";

export default class HashBasedRouting {

    private routes: IRoute[];

    constructor(routes: IRoute[]) {
        this.routes = routes;
    }

    public parse (
        url : string
    ) : IMatchedRoute | null {
        this.routes = this.routes.map(route => {
            route.nested = undefined;
            return route;
        })
        let matchedRoutes : IRoute[] = this.routes
            .reduce((total : IRoute[], current : IRoute) => {
                if (url.match(current.regexpPath as RegExp))
                    total.push(current);
                return total;
            }, []);
        let nestingDepth : number | undefined = 0;
        if (matchedRoutes.length > 1) {
            let matchedParent = matchedRoutes[0];
            for (let i = 0; i < matchedRoutes.length; i++) {
                matchedParent.nested = matchedRoutes[i];
                nestingDepth = matchedRoutes[i].nestingDepth;
                matchedParent = matchedParent.nested;
            }
        }
        return {
            route: matchedRoutes[0],
            transitionDepth: nestingDepth || 0,
        };
    }
}
