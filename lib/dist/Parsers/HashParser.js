"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var BuildRoutesTree_1 = require("../Utils/BuildRoutesTree");
var uniqBy_1 = __importDefault(require("lodash/uniqBy"));
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
            allMatched = __spreadArrays(allMatched, BuildRoutesTree_1.getRoutesTreeChain(_this.routes, route.id));
        });
        var unique = uniqBy_1.default(allMatched, 'id');
        if (!unique) {
            throw new Error('[Easyroute] No routes matched');
        }
        return unique;
    };
    return HashBasedRouting;
}());
exports.default = HashBasedRouting;
