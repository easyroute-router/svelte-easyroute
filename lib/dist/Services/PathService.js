"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_to_regexp_1 = require("path-to-regexp");
var IdGenerator_1 = __importDefault(require("../Utils/IdGenerator"));
var url_join_1 = __importDefault(require("url-join"));
var PathService = /** @class */ (function () {
    function PathService() {
        this.pathToRegexp = path_to_regexp_1.pathToRegexp;
    }
    PathService.prototype.parsePaths = function (routes) {
        var allRoutes = [];
        var recursive = function (routesArray, parentPath, nestingDepth, parentId) {
            if (parentPath === void 0) { parentPath = ''; }
            if (nestingDepth === void 0) { nestingDepth = 0; }
            if (parentId === void 0) { parentId = null; }
            routesArray.forEach(function (el) {
                if (parentPath.length) {
                    parentPath = parentPath.replace(/\*/g, '');
                    var elPath = el.path;
                    if (elPath != null && elPath[0] !== '/')
                        elPath = "/" + elPath;
                    el.path =
                        (parentPath[parentPath.length - 1] !== '/' ? parentPath : '') +
                            elPath;
                    el.nestingDepth = nestingDepth;
                }
                else {
                    el.nestingDepth = nestingDepth;
                }
                el.parentId = parentId;
                el.id = IdGenerator_1.default();
                allRoutes.push(el);
                if (el.children && el.children.length) {
                    recursive(el.children, el.path, nestingDepth + 1, el.id);
                }
            });
        };
        recursive(routes);
        return allRoutes;
    };
    PathService.prototype.getPathInformation = function (routes) {
        var _this = this;
        var allRoutes = this.parsePaths(routes);
        return allRoutes.map(function (route) {
            var keysArray = [];
            route.regexpPath = _this.pathToRegexp(route.path, keysArray);
            route.pathKeys = keysArray;
            return route;
        });
    };
    PathService.stripBase = function (url, base) {
        if (!base)
            return url;
        return url.replace(base + "/", '');
    };
    PathService.constructUrl = function (url, base) {
        if (!base || url.includes(base))
            return url;
        else
            return "/" + url_join_1.default(base, url);
    };
    return PathService;
}());
exports.default = PathService;
