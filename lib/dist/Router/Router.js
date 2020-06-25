"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var PathService_1 = __importDefault(require("../Services/PathService"));
var HashParser_1 = __importDefault(require("../Parsers/HashParser"));
var Observable_1 = __importDefault(require("../Utils/Observable"));
var UrlParser_1 = __importDefault(require("../Services/UrlParser"));
var SilentModeService_1 = __importDefault(require("../Services/SilentModeService"));
var Router = /** @class */ (function () {
    function Router(settings) {
        var _this = this;
        this.settings = settings;
        this.pathService = new PathService_1.default();
        this.routes = [];
        this.parser = null;
        this.ignoreEvents = false;
        this.silentControl = null;
        this.beforeEach = null;
        this.afterEach = null;
        this.currentMatched = new Observable_1.default([]);
        this.currentRouteData = new Observable_1.default({
            params: {},
            query: {},
            name: ''
        });
        this.routes = this.pathService.getPathInformation(settings.routes);
        setTimeout(function () {
            _this.setParser();
        }, 0);
    }
    Router.prototype.setParser = function () {
        var _this = this;
        switch (this.mode) {
            case 'silent':
                this.parser = new HashParser_1.default(this.routes);
                this.parseRoute("" + window.location.pathname + window.location.search);
                break;
            case 'history':
                this.parser = new HashParser_1.default(this.routes);
                this.parseRoute("" + window.location.pathname + window.location.search, false);
                window.addEventListener('popstate', function (ev) {
                    ev.state
                        ? _this.parseRoute(PathService_1.default.stripBase(ev.state.url, _this.base), false)
                        : _this.parseRoute('/', false);
                });
                break;
            case 'hash':
            default:
                this.parser = new HashParser_1.default(this.routes);
                this.parseRoute(PathService_1.default.stripBase(window.location.hash, this.base) || '/');
                window.addEventListener('hashchange', function () {
                    if (_this.ignoreEvents) {
                        _this.ignoreEvents = false;
                        return;
                    }
                    _this.parseRoute(PathService_1.default.stripBase(window.location.hash, _this.base));
                });
                break;
        }
    };
    Router.prototype.getTo = function (matched, url) {
        var depths = matched.map(function (route) { return route.nestingDepth; });
        var maxDepth = Math.max.apply(Math, depths);
        var currentRoute = matched.find(function (route) { return route.nestingDepth === maxDepth; });
        if (!currentRoute)
            return {
                params: {},
                query: {}
            };
        return Object.freeze(UrlParser_1.default.createRouteObject([currentRoute], url));
    };
    Router.prototype.getFrom = function () {
        if (!this.currentMatched.getValue)
            return {
                params: {},
                query: {}
            };
        var current = this.currentMatched.getValue;
        var depths = current.map(function (route) { return route.nestingDepth; });
        var maxDepth = Math.max.apply(Math, depths);
        var currentRoute = current.find(function (route) { return route.nestingDepth === maxDepth; });
        if (!currentRoute)
            return {
                params: {},
                query: {}
            };
        var url = this.currentRouteData.getValue.fullPath;
        return Object.freeze(UrlParser_1.default.createRouteObject([currentRoute], url));
    };
    Router.prototype.changeUrl = function (url, doPushState) {
        if (doPushState === void 0) { doPushState = true; }
        if (this.mode === 'hash') {
            window.location.hash = url;
        }
        if (this.mode === 'history' && doPushState) {
            window.history.pushState({
                url: url
            }, 'Test', url);
        }
    };
    Router.prototype.parseRoute = function (url, doPushState) {
        var _a;
        if (doPushState === void 0) { doPushState = true; }
        return __awaiter(this, void 0, void 0, function () {
            var matched, to, from, allowNext;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.mode === 'hash' && url.includes('#'))
                            url = url.replace('#', '');
                        if (this.mode === 'history' && url.includes('#'))
                            url = url.replace('#', '');
                        matched = (_a = this.parser) === null || _a === void 0 ? void 0 : _a.parse(url.split('?')[0]);
                        if (!matched)
                            return [2 /*return*/];
                        to = this.getTo(matched, url);
                        from = this.getFrom();
                        if (this.mode === 'silent' && !this.silentControl) {
                            this.silentControl = new SilentModeService_1.default(to);
                        }
                        if (this.silentControl && doPushState) {
                            this.silentControl.appendHistory(to);
                        }
                        return [4 /*yield*/, this.beforeHook(to, from)];
                    case 1:
                        allowNext = _b.sent();
                        if (!allowNext)
                            return [2 /*return*/];
                        this.changeUrl(PathService_1.default.constructUrl(url, this.base), doPushState);
                        this.currentRouteData.setValue(to);
                        this.currentMatched.setValue(matched);
                        this.afterHook(to, from);
                        return [2 /*return*/];
                }
            });
        });
    };
    Router.prototype.navigate = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.ignoreEvents = true;
                        return [4 /*yield*/, this.parseRoute(url)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Router.prototype.beforeHook = function (to, from) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        var next = function (command) {
                            if (command !== null && command !== undefined) {
                                if (command === false) {
                                    resolve(false);
                                }
                                if (typeof command === 'string') {
                                    _this.parseRoute(command);
                                    resolve(false);
                                }
                            }
                            else
                                resolve(true);
                        };
                        if (!_this.beforeEach)
                            resolve(true);
                        else
                            _this.beforeEach(to, from, next);
                    })];
            });
        });
    };
    Router.prototype.afterHook = function (to, from) {
        this.afterEach && this.afterEach(to, from);
    };
    Router.prototype.push = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.navigate(data)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Router.prototype.go = function (howFar) {
        if (this.mode !== 'silent') {
            window.history.go(howFar);
        }
        else {
            console.log(this.silentControl.go(howFar));
            this.parseRoute(this.silentControl.go(howFar), false);
        }
    };
    Router.prototype.back = function () {
        this.go(-1);
    };
    Object.defineProperty(Router.prototype, "mode", {
        get: function () {
            return this.settings.mode;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Router.prototype, "base", {
        get: function () {
            var _a;
            return (_a = this.settings.base) !== null && _a !== void 0 ? _a : '';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Router.prototype, "currentRoute", {
        get: function () {
            return this.currentRouteData.getValue;
        },
        enumerable: false,
        configurable: true
    });
    return Router;
}());
exports.default = Router;
