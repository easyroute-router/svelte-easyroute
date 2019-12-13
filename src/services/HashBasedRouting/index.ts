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
        console.log(matchedRoutes);
        if (matchedRoutes.length > 1) {
            // for (let i = 0; i < matchedRoutes.length; i++) {
            //     let matched: IRoute | undefined = matchedRoutes[0];
            //     if (i === 0) matched.nested = matchedRoutes[i+1];
            //     else {
            //         for (let k = 0; k < i; k++) {
            //             if (matched.nested) matched = matched.nested;
            //         }
            //         matched = matchedRoutes[i+1];
            //     }
            // }
            // @TODO: Простроить цепочку нестедов в первый рут
            let matchedParent = matchedRoutes[0];
            for (let i = 0; i < matchedRoutes.length; i++) {
                matchedParent.nested = matchedRoutes[i];
                matchedParent = matchedParent.nested;
            }
        }
        console.log(matchedRoutes[0]);
        return matchedRoutes[0] || null;
    }
}
