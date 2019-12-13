import IRoute from "../../interfaces/IRoute";

export default class HashBasedRouting {

    private routes: IRoute[];

    constructor(routes: IRoute[]) {
        this.routes = routes;
    }

    public parse (
        url : string
    ) : IRoute | null {
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
        if (matchedRoutes.length > 1) {
            for (let i = 1; i < matchedRoutes.length; i++) {
                matchedRoutes[i-1].nested = matchedRoutes[i];
            }
        }
        console.log(matchedRoutes[0]);
        return matchedRoutes[0] || null;
    }
}
