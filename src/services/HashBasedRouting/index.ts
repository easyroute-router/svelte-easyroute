import IRoute from "../../interfaces/IRoute";

export default class HashBasedRouting {

    private routes: IRoute[];

    constructor(routes: IRoute[]) {
        this.routes = routes;
    }

    public parse (
        url : string
    ) : IRoute | null {
        let matchedRoutes : IRoute[] = this.routes
            .reduce((total : IRoute[], current : IRoute) => {
                if (url.match(current.regexpPath as RegExp))
                    total.push(current);
                return total;
            }, []);
        return matchedRoutes[0] || null;
    }
}
