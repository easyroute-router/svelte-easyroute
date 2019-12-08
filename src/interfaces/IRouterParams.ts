import IRoute from "./IRoute";

export default interface IRouterParams {
    mode?: string,
    routes: IRoute[],
    afterUpdate?: Function,
    beforeEach?: Function,
    afterEach?: Function,
    base?: string,
    transition?: string
}
