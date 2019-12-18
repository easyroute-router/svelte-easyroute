import IRouteInfo from "./IRouteInfo";
import IRoute from "./IRoute";

export default interface IRouteComplexData {
    routeInfo: IRouteInfo,
    routeObject: IRoute,
    nestingTo?: number,
    nestingFrom?: number
}
