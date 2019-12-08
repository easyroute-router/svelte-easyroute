import IRoute from "./IRoute";

export default interface IRouter {
    routes : IRoute[],
    afterUpdate : Function | undefined,
    beforeEach : Function | undefined,
    afterEach : Function | undefined,
    currentRoute : IRoute | undefined,
    fullUrl : string,
    baseUrl : string
}
