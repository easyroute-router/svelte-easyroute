import IRoute from "./IRoute";

export default interface IMatchedRoute {
    route: IRoute,
    transitionDepth: number
}
