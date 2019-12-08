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
});
