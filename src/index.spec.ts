import Router from "./index";
import {RouterException} from "./exceptions/RouterException";
import IRouterParams from "./interfaces/IRouterParams";
import IRoute from "./interfaces/IRoute";

const testParams : IRouterParams = {
    mode: "history",
    base: "testbase",
    routes: [{
        path: "/test/:param1/test/param2"
    }],
    afterUpdate: undefined,
    beforeEach: undefined,
    afterEach: undefined,
};

describe("Base router class", () => {
    it("Should set router mode passed", () => {
        let router = new Router(testParams);
        expect(router.mode).toBe("history");
    });

    it("Should set default hash mode if passed mode is invalid", () => {
        let _testParams = JSON.parse(JSON.stringify(testParams));
        _testParams.mode = "unexistant";
        let router = new Router(_testParams);
        expect(router.mode).toBe("hash");
    });

    it("Correctly formats base url with no slashes", () => {
        let router = new Router(testParams);
        expect(router.baseUrl).toBe("/testbase/");
    });

    it("Correctly formats base url with slash in the beginning", () => {
        let _testParams = JSON.parse(JSON.stringify(testParams));
        _testParams.base = "/testbase";
        let router = new Router(_testParams);
        expect(router.baseUrl).toBe("/testbase/");
    });

    it("Correctly formats base url with slash in the end", () => {
        let _testParams = JSON.parse(JSON.stringify(testParams));
        _testParams.base = "testbase/";
        let router = new Router(_testParams);
        expect(router.baseUrl).toBe("/testbase/");
    });

    it("Correctly finds a path-parameter in route", () => {
        let _testParams = JSON.parse(JSON.stringify(testParams));
        _testParams.mode = "hash";
        let router = new Router(_testParams);
        router.parseRoute("/test/paramurl/test/param2");
        expect(router!.currentRoute!.routeInfo.params.param1).toBe('paramurl');
    });

    it("Does not treat '*' as path-parameter", () => {
        let _testParams = JSON.parse(JSON.stringify(testParams));
        _testParams.mode = "hash";
        _testParams.routes[0].path ="/test/:param1/*";
        let router = new Router(_testParams);
        router.parseRoute("/test/paramurl/test/param2");
        expect(router!.currentRoute!.routeInfo.params[0]).toBeFalsy();
    });
});
