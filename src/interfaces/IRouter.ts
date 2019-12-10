import IRoute from "./IRoute";
import IRouteComplexData from "./IRouteComplexData";

export default interface IRouter {
    routes : IRoute[],
    afterUpdate : Function | undefined,
    beforeEach : Function | undefined,
    afterEach : Function | undefined,
    currentRoute : IRouteComplexData | undefined,
    previousRoute: IRouteComplexData | undefined,
    fullUrl : string,
    baseUrl : string
}
