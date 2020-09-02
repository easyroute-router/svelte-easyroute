import { Route } from '../Router/types';
export default class HashBasedRouting {
    private routes;
    constructor(routes: Route[]);
    parse(url: string): Route[];
}
