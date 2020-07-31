"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var BuildRoutesTree_1 = require("../Utils/BuildRoutesTree");
var uniqueBy_1 = require("../Utils/uniqueBy");
var HashBasedRouting = /** @class */ (function () {
    function HashBasedRouting(routes) {
        this.routes = routes;
    }
    HashBasedRouting.prototype.parse = function (url) {
        var _this = this;
        var matchedRoutes = this.routes.reduce(function (total, current) {
            if (url.match(current.regexpPath))
                total.push(current);
            return total;
        }, []);
        var allMatched = [];
        matchedRoutes.forEach(function (route) {
            allMatched = __spread(allMatched, BuildRoutesTree_1.getRoutesTreeChain(_this.routes, route.id));
        });
        var unique = uniqueBy_1.uniqueById(allMatched);
        if (!unique) {
            throw new Error('[Easyroute] No routes matched');
        }
        return unique;
    };
    return HashBasedRouting;
}());
exports.default = HashBasedRouting;
