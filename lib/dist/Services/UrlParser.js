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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var query_string_1 = __importDefault(require("query-string"));
var UrlParser = /** @class */ (function () {
    function UrlParser() {
    }
    UrlParser.getQueryParams = function (queryString) {
        return query_string_1.default.parse(queryString);
    };
    UrlParser.getPathParams = function (matchedRoute, url) {
        var pathValues = matchedRoute.regexpPath.exec(url);
        pathValues = pathValues.slice(1, pathValues.length);
        var urlParams = {};
        for (var pathPart in pathValues) {
            var value = pathValues[pathPart];
            var key = matchedRoute.pathKeys[pathPart].name;
            if (typeof key !== 'number')
                urlParams[key] = value;
        }
        return urlParams;
    };
    UrlParser.createRouteObject = function (matchedRoutes, url) {
        var _a;
        var depths = matchedRoutes.map(function (route) { return route.nestingDepth; });
        var maxDepth = Math.max.apply(Math, __spread(depths));
        var currentMatched = matchedRoutes.find(function (route) { return route.nestingDepth === maxDepth; });
        var _b = __read(url.split('?'), 2), pathString = _b[0], queryString = _b[1];
        if (currentMatched) {
            var pathParams = UrlParser.getPathParams(currentMatched, pathString);
            var queryParams = UrlParser.getQueryParams(queryString);
            return {
                params: pathParams,
                query: queryParams,
                name: currentMatched.name,
                fullPath: url,
                meta: (_a = currentMatched.meta) !== null && _a !== void 0 ? _a : {}
            };
        }
        return {
            params: {},
            query: {}
        };
    };
    return UrlParser;
}());
exports.default = UrlParser;
