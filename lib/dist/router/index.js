(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.easyroute = factory());
}(this, (function () { 'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function unwrapExports (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	/*! *****************************************************************************
	Copyright (c) Microsoft Corporation.

	Permission to use, copy, modify, and/or distribute this software for any
	purpose with or without fee is hereby granted.

	THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
	REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
	AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
	INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
	LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
	OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
	PERFORMANCE OF THIS SOFTWARE.
	***************************************************************************** */
	/* global Reflect, Promise */

	var extendStatics = function(d, b) {
	    extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
	    return extendStatics(d, b);
	};

	function __extends(d, b) {
	    extendStatics(d, b);
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	}

	var __assign = function() {
	    __assign = Object.assign || function __assign(t) {
	        for (var s, i = 1, n = arguments.length; i < n; i++) {
	            s = arguments[i];
	            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
	        }
	        return t;
	    };
	    return __assign.apply(this, arguments);
	};

	function __rest(s, e) {
	    var t = {};
	    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
	        t[p] = s[p];
	    if (s != null && typeof Object.getOwnPropertySymbols === "function")
	        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
	            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
	                t[p[i]] = s[p[i]];
	        }
	    return t;
	}

	function __decorate(decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	}

	function __param(paramIndex, decorator) {
	    return function (target, key) { decorator(target, key, paramIndex); }
	}

	function __metadata(metadataKey, metadataValue) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
	}

	function __awaiter(thisArg, _arguments, P, generator) {
	    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	}

	function __generator(thisArg, body) {
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
	}

	var __createBinding = Object.create ? (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
	}) : (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    o[k2] = m[k];
	});

	function __exportStar(m, o) {
	    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
	}

	function __values(o) {
	    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
	    if (m) return m.call(o);
	    if (o && typeof o.length === "number") return {
	        next: function () {
	            if (o && i >= o.length) o = void 0;
	            return { value: o && o[i++], done: !o };
	        }
	    };
	    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
	}

	function __read(o, n) {
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
	}

	function __spread() {
	    for (var ar = [], i = 0; i < arguments.length; i++)
	        ar = ar.concat(__read(arguments[i]));
	    return ar;
	}

	function __spreadArrays() {
	    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
	    for (var r = Array(s), k = 0, i = 0; i < il; i++)
	        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
	            r[k] = a[j];
	    return r;
	}
	function __await(v) {
	    return this instanceof __await ? (this.v = v, this) : new __await(v);
	}

	function __asyncGenerator(thisArg, _arguments, generator) {
	    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
	    var g = generator.apply(thisArg, _arguments || []), i, q = [];
	    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
	    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
	    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
	    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
	    function fulfill(value) { resume("next", value); }
	    function reject(value) { resume("throw", value); }
	    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
	}

	function __asyncDelegator(o) {
	    var i, p;
	    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
	    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
	}

	function __asyncValues(o) {
	    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
	    var m = o[Symbol.asyncIterator], i;
	    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
	    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
	    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
	}

	function __makeTemplateObject(cooked, raw) {
	    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
	    return cooked;
	}
	var __setModuleDefault = Object.create ? (function(o, v) {
	    Object.defineProperty(o, "default", { enumerable: true, value: v });
	}) : function(o, v) {
	    o["default"] = v;
	};

	function __importStar(mod) {
	    if (mod && mod.__esModule) return mod;
	    var result = {};
	    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
	    __setModuleDefault(result, mod);
	    return result;
	}

	function __importDefault(mod) {
	    return (mod && mod.__esModule) ? mod : { default: mod };
	}

	function __classPrivateFieldGet(receiver, privateMap) {
	    if (!privateMap.has(receiver)) {
	        throw new TypeError("attempted to get private field on non-instance");
	    }
	    return privateMap.get(receiver);
	}

	function __classPrivateFieldSet(receiver, privateMap, value) {
	    if (!privateMap.has(receiver)) {
	        throw new TypeError("attempted to set private field on non-instance");
	    }
	    privateMap.set(receiver, value);
	    return value;
	}

	var tslib_es6 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		__extends: __extends,
		get __assign () { return __assign; },
		__rest: __rest,
		__decorate: __decorate,
		__param: __param,
		__metadata: __metadata,
		__awaiter: __awaiter,
		__generator: __generator,
		__createBinding: __createBinding,
		__exportStar: __exportStar,
		__values: __values,
		__read: __read,
		__spread: __spread,
		__spreadArrays: __spreadArrays,
		__await: __await,
		__asyncGenerator: __asyncGenerator,
		__asyncDelegator: __asyncDelegator,
		__asyncValues: __asyncValues,
		__makeTemplateObject: __makeTemplateObject,
		__importStar: __importStar,
		__importDefault: __importDefault,
		__classPrivateFieldGet: __classPrivateFieldGet,
		__classPrivateFieldSet: __classPrivateFieldSet
	});

	/**
	 * Tokenize input string.
	 */
	function lexer(str) {
	    var tokens = [];
	    var i = 0;
	    while (i < str.length) {
	        var char = str[i];
	        if (char === "*" || char === "+" || char === "?") {
	            tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
	            continue;
	        }
	        if (char === "\\") {
	            tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
	            continue;
	        }
	        if (char === "{") {
	            tokens.push({ type: "OPEN", index: i, value: str[i++] });
	            continue;
	        }
	        if (char === "}") {
	            tokens.push({ type: "CLOSE", index: i, value: str[i++] });
	            continue;
	        }
	        if (char === ":") {
	            var name = "";
	            var j = i + 1;
	            while (j < str.length) {
	                var code = str.charCodeAt(j);
	                if (
	                // `0-9`
	                (code >= 48 && code <= 57) ||
	                    // `A-Z`
	                    (code >= 65 && code <= 90) ||
	                    // `a-z`
	                    (code >= 97 && code <= 122) ||
	                    // `_`
	                    code === 95) {
	                    name += str[j++];
	                    continue;
	                }
	                break;
	            }
	            if (!name)
	                throw new TypeError("Missing parameter name at " + i);
	            tokens.push({ type: "NAME", index: i, value: name });
	            i = j;
	            continue;
	        }
	        if (char === "(") {
	            var count = 1;
	            var pattern = "";
	            var j = i + 1;
	            if (str[j] === "?") {
	                throw new TypeError("Pattern cannot start with \"?\" at " + j);
	            }
	            while (j < str.length) {
	                if (str[j] === "\\") {
	                    pattern += str[j++] + str[j++];
	                    continue;
	                }
	                if (str[j] === ")") {
	                    count--;
	                    if (count === 0) {
	                        j++;
	                        break;
	                    }
	                }
	                else if (str[j] === "(") {
	                    count++;
	                    if (str[j + 1] !== "?") {
	                        throw new TypeError("Capturing groups are not allowed at " + j);
	                    }
	                }
	                pattern += str[j++];
	            }
	            if (count)
	                throw new TypeError("Unbalanced pattern at " + i);
	            if (!pattern)
	                throw new TypeError("Missing pattern at " + i);
	            tokens.push({ type: "PATTERN", index: i, value: pattern });
	            i = j;
	            continue;
	        }
	        tokens.push({ type: "CHAR", index: i, value: str[i++] });
	    }
	    tokens.push({ type: "END", index: i, value: "" });
	    return tokens;
	}
	/**
	 * Parse a string for the raw tokens.
	 */
	function parse(str, options) {
	    if (options === void 0) { options = {}; }
	    var tokens = lexer(str);
	    var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a;
	    var defaultPattern = "[^" + escapeString(options.delimiter || "/#?") + "]+?";
	    var result = [];
	    var key = 0;
	    var i = 0;
	    var path = "";
	    var tryConsume = function (type) {
	        if (i < tokens.length && tokens[i].type === type)
	            return tokens[i++].value;
	    };
	    var mustConsume = function (type) {
	        var value = tryConsume(type);
	        if (value !== undefined)
	            return value;
	        var _a = tokens[i], nextType = _a.type, index = _a.index;
	        throw new TypeError("Unexpected " + nextType + " at " + index + ", expected " + type);
	    };
	    var consumeText = function () {
	        var result = "";
	        var value;
	        // tslint:disable-next-line
	        while ((value = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR"))) {
	            result += value;
	        }
	        return result;
	    };
	    while (i < tokens.length) {
	        var char = tryConsume("CHAR");
	        var name = tryConsume("NAME");
	        var pattern = tryConsume("PATTERN");
	        if (name || pattern) {
	            var prefix = char || "";
	            if (prefixes.indexOf(prefix) === -1) {
	                path += prefix;
	                prefix = "";
	            }
	            if (path) {
	                result.push(path);
	                path = "";
	            }
	            result.push({
	                name: name || key++,
	                prefix: prefix,
	                suffix: "",
	                pattern: pattern || defaultPattern,
	                modifier: tryConsume("MODIFIER") || ""
	            });
	            continue;
	        }
	        var value = char || tryConsume("ESCAPED_CHAR");
	        if (value) {
	            path += value;
	            continue;
	        }
	        if (path) {
	            result.push(path);
	            path = "";
	        }
	        var open = tryConsume("OPEN");
	        if (open) {
	            var prefix = consumeText();
	            var name_1 = tryConsume("NAME") || "";
	            var pattern_1 = tryConsume("PATTERN") || "";
	            var suffix = consumeText();
	            mustConsume("CLOSE");
	            result.push({
	                name: name_1 || (pattern_1 ? key++ : ""),
	                pattern: name_1 && !pattern_1 ? defaultPattern : pattern_1,
	                prefix: prefix,
	                suffix: suffix,
	                modifier: tryConsume("MODIFIER") || ""
	            });
	            continue;
	        }
	        mustConsume("END");
	    }
	    return result;
	}
	/**
	 * Compile a string to a template function for the path.
	 */
	function compile(str, options) {
	    return tokensToFunction(parse(str, options), options);
	}
	/**
	 * Expose a method for transforming tokens into the path function.
	 */
	function tokensToFunction(tokens, options) {
	    if (options === void 0) { options = {}; }
	    var reFlags = flags(options);
	    var _a = options.encode, encode = _a === void 0 ? function (x) { return x; } : _a, _b = options.validate, validate = _b === void 0 ? true : _b;
	    // Compile all the tokens into regexps.
	    var matches = tokens.map(function (token) {
	        if (typeof token === "object") {
	            return new RegExp("^(?:" + token.pattern + ")$", reFlags);
	        }
	    });
	    return function (data) {
	        var path = "";
	        for (var i = 0; i < tokens.length; i++) {
	            var token = tokens[i];
	            if (typeof token === "string") {
	                path += token;
	                continue;
	            }
	            var value = data ? data[token.name] : undefined;
	            var optional = token.modifier === "?" || token.modifier === "*";
	            var repeat = token.modifier === "*" || token.modifier === "+";
	            if (Array.isArray(value)) {
	                if (!repeat) {
	                    throw new TypeError("Expected \"" + token.name + "\" to not repeat, but got an array");
	                }
	                if (value.length === 0) {
	                    if (optional)
	                        continue;
	                    throw new TypeError("Expected \"" + token.name + "\" to not be empty");
	                }
	                for (var j = 0; j < value.length; j++) {
	                    var segment = encode(value[j], token);
	                    if (validate && !matches[i].test(segment)) {
	                        throw new TypeError("Expected all \"" + token.name + "\" to match \"" + token.pattern + "\", but got \"" + segment + "\"");
	                    }
	                    path += token.prefix + segment + token.suffix;
	                }
	                continue;
	            }
	            if (typeof value === "string" || typeof value === "number") {
	                var segment = encode(String(value), token);
	                if (validate && !matches[i].test(segment)) {
	                    throw new TypeError("Expected \"" + token.name + "\" to match \"" + token.pattern + "\", but got \"" + segment + "\"");
	                }
	                path += token.prefix + segment + token.suffix;
	                continue;
	            }
	            if (optional)
	                continue;
	            var typeOfMessage = repeat ? "an array" : "a string";
	            throw new TypeError("Expected \"" + token.name + "\" to be " + typeOfMessage);
	        }
	        return path;
	    };
	}
	/**
	 * Create path match function from `path-to-regexp` spec.
	 */
	function match(str, options) {
	    var keys = [];
	    var re = pathToRegexp(str, keys, options);
	    return regexpToFunction(re, keys, options);
	}
	/**
	 * Create a path match function from `path-to-regexp` output.
	 */
	function regexpToFunction(re, keys, options) {
	    if (options === void 0) { options = {}; }
	    var _a = options.decode, decode = _a === void 0 ? function (x) { return x; } : _a;
	    return function (pathname) {
	        var m = re.exec(pathname);
	        if (!m)
	            return false;
	        var path = m[0], index = m.index;
	        var params = Object.create(null);
	        var _loop_1 = function (i) {
	            // tslint:disable-next-line
	            if (m[i] === undefined)
	                return "continue";
	            var key = keys[i - 1];
	            if (key.modifier === "*" || key.modifier === "+") {
	                params[key.name] = m[i].split(key.prefix + key.suffix).map(function (value) {
	                    return decode(value, key);
	                });
	            }
	            else {
	                params[key.name] = decode(m[i], key);
	            }
	        };
	        for (var i = 1; i < m.length; i++) {
	            _loop_1(i);
	        }
	        return { path: path, index: index, params: params };
	    };
	}
	/**
	 * Escape a regular expression string.
	 */
	function escapeString(str) {
	    return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
	}
	/**
	 * Get the flags for a regexp from the options.
	 */
	function flags(options) {
	    return options && options.sensitive ? "" : "i";
	}
	/**
	 * Pull out keys from a regexp.
	 */
	function regexpToRegexp(path, keys) {
	    if (!keys)
	        return path;
	    // Use a negative lookahead to match only capturing groups.
	    var groups = path.source.match(/\((?!\?)/g);
	    if (groups) {
	        for (var i = 0; i < groups.length; i++) {
	            keys.push({
	                name: i,
	                prefix: "",
	                suffix: "",
	                modifier: "",
	                pattern: ""
	            });
	        }
	    }
	    return path;
	}
	/**
	 * Transform an array into a regexp.
	 */
	function arrayToRegexp(paths, keys, options) {
	    var parts = paths.map(function (path) { return pathToRegexp(path, keys, options).source; });
	    return new RegExp("(?:" + parts.join("|") + ")", flags(options));
	}
	/**
	 * Create a path regexp from string input.
	 */
	function stringToRegexp(path, keys, options) {
	    return tokensToRegexp(parse(path, options), keys, options);
	}
	/**
	 * Expose a function for taking tokens and returning a RegExp.
	 */
	function tokensToRegexp(tokens, keys, options) {
	    if (options === void 0) { options = {}; }
	    var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function (x) { return x; } : _d;
	    var endsWith = "[" + escapeString(options.endsWith || "") + "]|$";
	    var delimiter = "[" + escapeString(options.delimiter || "/#?") + "]";
	    var route = start ? "^" : "";
	    // Iterate over the tokens and create our regexp string.
	    for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
	        var token = tokens_1[_i];
	        if (typeof token === "string") {
	            route += escapeString(encode(token));
	        }
	        else {
	            var prefix = escapeString(encode(token.prefix));
	            var suffix = escapeString(encode(token.suffix));
	            if (token.pattern) {
	                if (keys)
	                    keys.push(token);
	                if (prefix || suffix) {
	                    if (token.modifier === "+" || token.modifier === "*") {
	                        var mod = token.modifier === "*" ? "?" : "";
	                        route += "(?:" + prefix + "((?:" + token.pattern + ")(?:" + suffix + prefix + "(?:" + token.pattern + "))*)" + suffix + ")" + mod;
	                    }
	                    else {
	                        route += "(?:" + prefix + "(" + token.pattern + ")" + suffix + ")" + token.modifier;
	                    }
	                }
	                else {
	                    route += "(" + token.pattern + ")" + token.modifier;
	                }
	            }
	            else {
	                route += "(?:" + prefix + suffix + ")" + token.modifier;
	            }
	        }
	    }
	    if (end) {
	        if (!strict)
	            route += delimiter + "?";
	        route += !options.endsWith ? "$" : "(?=" + endsWith + ")";
	    }
	    else {
	        var endToken = tokens[tokens.length - 1];
	        var isEndDelimited = typeof endToken === "string"
	            ? delimiter.indexOf(endToken[endToken.length - 1]) > -1
	            : // tslint:disable-next-line
	                endToken === undefined;
	        if (!strict) {
	            route += "(?:" + delimiter + "(?=" + endsWith + "))?";
	        }
	        if (!isEndDelimited) {
	            route += "(?=" + delimiter + "|" + endsWith + ")";
	        }
	    }
	    return new RegExp(route, flags(options));
	}
	/**
	 * Normalize the given path string, returning a regular expression.
	 *
	 * An empty array can be passed in for the keys, which will hold the
	 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
	 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
	 */
	function pathToRegexp(path, keys, options) {
	    if (path instanceof RegExp)
	        return regexpToRegexp(path, keys);
	    if (Array.isArray(path))
	        return arrayToRegexp(path, keys, options);
	    return stringToRegexp(path, keys, options);
	}

	var dist_es2015 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		parse: parse,
		compile: compile,
		tokensToFunction: tokensToFunction,
		match: match,
		regexpToFunction: regexpToFunction,
		tokensToRegexp: tokensToRegexp,
		pathToRegexp: pathToRegexp
	});

	var IdGenerator = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	function generateId() {
	    return Math.random().toString(36).substr(2, 9);
	}
	exports.default = generateId;

	});

	unwrapExports(IdGenerator);

	var urlJoin = createCommonjsModule(function (module) {
	(function (name, context, definition) {
	  if ( module.exports) module.exports = definition();
	  else context[name] = definition();
	})('urljoin', commonjsGlobal, function () {

	  function normalize (strArray) {
	    var resultArray = [];
	    if (strArray.length === 0) { return ''; }

	    if (typeof strArray[0] !== 'string') {
	      throw new TypeError('Url must be a string. Received ' + strArray[0]);
	    }

	    // If the first part is a plain protocol, we combine it with the next part.
	    if (strArray[0].match(/^[^/:]+:\/*$/) && strArray.length > 1) {
	      var first = strArray.shift();
	      strArray[0] = first + strArray[0];
	    }

	    // There must be two or three slashes in the file protocol, two slashes in anything else.
	    if (strArray[0].match(/^file:\/\/\//)) {
	      strArray[0] = strArray[0].replace(/^([^/:]+):\/*/, '$1:///');
	    } else {
	      strArray[0] = strArray[0].replace(/^([^/:]+):\/*/, '$1://');
	    }

	    for (var i = 0; i < strArray.length; i++) {
	      var component = strArray[i];

	      if (typeof component !== 'string') {
	        throw new TypeError('Url must be a string. Received ' + component);
	      }

	      if (component === '') { continue; }

	      if (i > 0) {
	        // Removing the starting slashes for each component but the first.
	        component = component.replace(/^[\/]+/, '');
	      }
	      if (i < strArray.length - 1) {
	        // Removing the ending slashes for each component but the last.
	        component = component.replace(/[\/]+$/, '');
	      } else {
	        // For the last component we will combine multiple slashes to a single one.
	        component = component.replace(/[\/]+$/, '/');
	      }

	      resultArray.push(component);

	    }

	    var str = resultArray.join('/');
	    // Each input component is now separated by a single slash except the possible first plain protocol part.

	    // remove trailing slash before parameters or hash
	    str = str.replace(/\/(\?|&|#[^!])/g, '$1');

	    // replace ? in parameters with &
	    var parts = str.split('?');
	    str = parts.shift() + (parts.length > 0 ? '?': '') + parts.join('&');

	    return str;
	  }

	  return function () {
	    var input;

	    if (typeof arguments[0] === 'object') {
	      input = arguments[0];
	    } else {
	      input = [].slice.call(arguments);
	    }

	    return normalize(input);
	  };

	});
	});

	var PathService_1 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });


	var IdGenerator_1 = tslib_es6.__importDefault(IdGenerator);
	var url_join_1 = tslib_es6.__importDefault(urlJoin);
	var PathService = /** @class */ (function () {
	    function PathService() {
	        this.pathToRegexp = dist_es2015.pathToRegexp;
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

	});

	unwrapExports(PathService_1);

	var BuildRoutesTree = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.getRoutesTreeChain = void 0;
	function getRoutesTreeChain(allRoutes, currentId) {
	    var tree = [];
	    var currentSeekingIds = currentId;
	    var currentRoute = allRoutes.find(function (route) { return route.id === currentSeekingIds; });
	    var _loop_1 = function () {
	        var currentRoute_1 = allRoutes.find(function (route) { return route.id === currentSeekingIds; });
	        if (currentRoute_1) {
	            var seed = allRoutes.find(function (route) { return route.id === currentRoute_1.parentId; });
	            if (seed) {
	                tree.push(seed);
	                currentSeekingIds = seed.id;
	            }
	            else {
	                currentSeekingIds = null;
	            }
	        }
	        else
	            return "break";
	    };
	    do {
	        var state_1 = _loop_1();
	        if (state_1 === "break")
	            break;
	    } while (currentSeekingIds);
	    currentRoute && tree.push(currentRoute);
	    return tree;
	}
	exports.getRoutesTreeChain = getRoutesTreeChain;

	});

	unwrapExports(BuildRoutesTree);
	var BuildRoutesTree_1 = BuildRoutesTree.getRoutesTreeChain;

	var uniqueBy = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.uniqueById = void 0;

	function uniqueById(routesArray) {
	    var uniqueIds = tslib_es6.__spread(new Set(routesArray.map(function (route) { return route.id; })));
	    return uniqueIds.map(function (id) { return routesArray.find(function (route) { return route.id === id; }); });
	}
	exports.uniqueById = uniqueById;

	});

	unwrapExports(uniqueBy);
	var uniqueBy_1 = uniqueBy.uniqueById;

	var HashParser = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });



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
	            allMatched = tslib_es6.__spread(allMatched, BuildRoutesTree.getRoutesTreeChain(_this.routes, route.id));
	        });
	        var unique = uniqueBy.uniqueById(allMatched);
	        if (!unique) {
	            throw new Error('[Easyroute] No routes matched');
	        }
	        return unique;
	    };
	    return HashBasedRouting;
	}());
	exports.default = HashBasedRouting;

	});

	unwrapExports(HashParser);

	var Observable_1 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });

	var IdGenerator_1 = tslib_es6.__importDefault(IdGenerator);
	var Observable = /** @class */ (function () {
	    function Observable(value) {
	        this.value = value;
	        this._subscribersQueue = {};
	    }
	    Object.defineProperty(Observable.prototype, "getValue", {
	        get: function () {
	            return this.value;
	        },
	        enumerable: false,
	        configurable: true
	    });
	    Observable.prototype.subscribe = function (listener) {
	        var _this = this;
	        var id = IdGenerator_1.default();
	        this._subscribersQueue[id] = listener;
	        listener(this.getValue);
	        return function () {
	            delete _this._subscribersQueue[id];
	        };
	    };
	    Observable.prototype.setValue = function (newValue) {
	        this.value = newValue;
	        for (var key in this._subscribersQueue) {
	            var subscriber = this._subscribersQueue[key];
	            subscriber(this.value);
	        }
	    };
	    return Observable;
	}());
	exports.default = Observable;

	});

	unwrapExports(Observable_1);

	var strictUriEncode = str => encodeURIComponent(str).replace(/[!'()*]/g, x => `%${x.charCodeAt(0).toString(16).toUpperCase()}`);

	var token = '%[a-f0-9]{2}';
	var singleMatcher = new RegExp(token, 'gi');
	var multiMatcher = new RegExp('(' + token + ')+', 'gi');

	function decodeComponents(components, split) {
		try {
			// Try to decode the entire string first
			return decodeURIComponent(components.join(''));
		} catch (err) {
			// Do nothing
		}

		if (components.length === 1) {
			return components;
		}

		split = split || 1;

		// Split the array in 2 parts
		var left = components.slice(0, split);
		var right = components.slice(split);

		return Array.prototype.concat.call([], decodeComponents(left), decodeComponents(right));
	}

	function decode(input) {
		try {
			return decodeURIComponent(input);
		} catch (err) {
			var tokens = input.match(singleMatcher);

			for (var i = 1; i < tokens.length; i++) {
				input = decodeComponents(tokens, i).join('');

				tokens = input.match(singleMatcher);
			}

			return input;
		}
	}

	function customDecodeURIComponent(input) {
		// Keep track of all the replacements and prefill the map with the `BOM`
		var replaceMap = {
			'%FE%FF': '\uFFFD\uFFFD',
			'%FF%FE': '\uFFFD\uFFFD'
		};

		var match = multiMatcher.exec(input);
		while (match) {
			try {
				// Decode as big chunks as possible
				replaceMap[match[0]] = decodeURIComponent(match[0]);
			} catch (err) {
				var result = decode(match[0]);

				if (result !== match[0]) {
					replaceMap[match[0]] = result;
				}
			}

			match = multiMatcher.exec(input);
		}

		// Add `%C2` at the end of the map to make sure it does not replace the combinator before everything else
		replaceMap['%C2'] = '\uFFFD';

		var entries = Object.keys(replaceMap);

		for (var i = 0; i < entries.length; i++) {
			// Replace all decoded components
			var key = entries[i];
			input = input.replace(new RegExp(key, 'g'), replaceMap[key]);
		}

		return input;
	}

	var decodeUriComponent = function (encodedURI) {
		if (typeof encodedURI !== 'string') {
			throw new TypeError('Expected `encodedURI` to be of type `string`, got `' + typeof encodedURI + '`');
		}

		try {
			encodedURI = encodedURI.replace(/\+/g, ' ');

			// Try the built in decoder first
			return decodeURIComponent(encodedURI);
		} catch (err) {
			// Fallback to a more advanced decoder
			return customDecodeURIComponent(encodedURI);
		}
	};

	var splitOnFirst = (string, separator) => {
		if (!(typeof string === 'string' && typeof separator === 'string')) {
			throw new TypeError('Expected the arguments to be of type `string`');
		}

		if (separator === '') {
			return [string];
		}

		const separatorIndex = string.indexOf(separator);

		if (separatorIndex === -1) {
			return [string];
		}

		return [
			string.slice(0, separatorIndex),
			string.slice(separatorIndex + separator.length)
		];
	};

	var queryString = createCommonjsModule(function (module, exports) {




	const isNullOrUndefined = value => value === null || value === undefined;

	function encoderForArrayFormat(options) {
		switch (options.arrayFormat) {
			case 'index':
				return key => (result, value) => {
					const index = result.length;

					if (
						value === undefined ||
						(options.skipNull && value === null) ||
						(options.skipEmptyString && value === '')
					) {
						return result;
					}

					if (value === null) {
						return [...result, [encode(key, options), '[', index, ']'].join('')];
					}

					return [
						...result,
						[encode(key, options), '[', encode(index, options), ']=', encode(value, options)].join('')
					];
				};

			case 'bracket':
				return key => (result, value) => {
					if (
						value === undefined ||
						(options.skipNull && value === null) ||
						(options.skipEmptyString && value === '')
					) {
						return result;
					}

					if (value === null) {
						return [...result, [encode(key, options), '[]'].join('')];
					}

					return [...result, [encode(key, options), '[]=', encode(value, options)].join('')];
				};

			case 'comma':
			case 'separator':
				return key => (result, value) => {
					if (value === null || value === undefined || value.length === 0) {
						return result;
					}

					if (result.length === 0) {
						return [[encode(key, options), '=', encode(value, options)].join('')];
					}

					return [[result, encode(value, options)].join(options.arrayFormatSeparator)];
				};

			default:
				return key => (result, value) => {
					if (
						value === undefined ||
						(options.skipNull && value === null) ||
						(options.skipEmptyString && value === '')
					) {
						return result;
					}

					if (value === null) {
						return [...result, encode(key, options)];
					}

					return [...result, [encode(key, options), '=', encode(value, options)].join('')];
				};
		}
	}

	function parserForArrayFormat(options) {
		let result;

		switch (options.arrayFormat) {
			case 'index':
				return (key, value, accumulator) => {
					result = /\[(\d*)\]$/.exec(key);

					key = key.replace(/\[\d*\]$/, '');

					if (!result) {
						accumulator[key] = value;
						return;
					}

					if (accumulator[key] === undefined) {
						accumulator[key] = {};
					}

					accumulator[key][result[1]] = value;
				};

			case 'bracket':
				return (key, value, accumulator) => {
					result = /(\[\])$/.exec(key);
					key = key.replace(/\[\]$/, '');

					if (!result) {
						accumulator[key] = value;
						return;
					}

					if (accumulator[key] === undefined) {
						accumulator[key] = [value];
						return;
					}

					accumulator[key] = [].concat(accumulator[key], value);
				};

			case 'comma':
			case 'separator':
				return (key, value, accumulator) => {
					const isArray = typeof value === 'string' && value.split('').indexOf(options.arrayFormatSeparator) > -1;
					const newValue = isArray ? value.split(options.arrayFormatSeparator).map(item => decode(item, options)) : value === null ? value : decode(value, options);
					accumulator[key] = newValue;
				};

			default:
				return (key, value, accumulator) => {
					if (accumulator[key] === undefined) {
						accumulator[key] = value;
						return;
					}

					accumulator[key] = [].concat(accumulator[key], value);
				};
		}
	}

	function validateArrayFormatSeparator(value) {
		if (typeof value !== 'string' || value.length !== 1) {
			throw new TypeError('arrayFormatSeparator must be single character string');
		}
	}

	function encode(value, options) {
		if (options.encode) {
			return options.strict ? strictUriEncode(value) : encodeURIComponent(value);
		}

		return value;
	}

	function decode(value, options) {
		if (options.decode) {
			return decodeUriComponent(value);
		}

		return value;
	}

	function keysSorter(input) {
		if (Array.isArray(input)) {
			return input.sort();
		}

		if (typeof input === 'object') {
			return keysSorter(Object.keys(input))
				.sort((a, b) => Number(a) - Number(b))
				.map(key => input[key]);
		}

		return input;
	}

	function removeHash(input) {
		const hashStart = input.indexOf('#');
		if (hashStart !== -1) {
			input = input.slice(0, hashStart);
		}

		return input;
	}

	function getHash(url) {
		let hash = '';
		const hashStart = url.indexOf('#');
		if (hashStart !== -1) {
			hash = url.slice(hashStart);
		}

		return hash;
	}

	function extract(input) {
		input = removeHash(input);
		const queryStart = input.indexOf('?');
		if (queryStart === -1) {
			return '';
		}

		return input.slice(queryStart + 1);
	}

	function parseValue(value, options) {
		if (options.parseNumbers && !Number.isNaN(Number(value)) && (typeof value === 'string' && value.trim() !== '')) {
			value = Number(value);
		} else if (options.parseBooleans && value !== null && (value.toLowerCase() === 'true' || value.toLowerCase() === 'false')) {
			value = value.toLowerCase() === 'true';
		}

		return value;
	}

	function parse(input, options) {
		options = Object.assign({
			decode: true,
			sort: true,
			arrayFormat: 'none',
			arrayFormatSeparator: ',',
			parseNumbers: false,
			parseBooleans: false
		}, options);

		validateArrayFormatSeparator(options.arrayFormatSeparator);

		const formatter = parserForArrayFormat(options);

		// Create an object with no prototype
		const ret = Object.create(null);

		if (typeof input !== 'string') {
			return ret;
		}

		input = input.trim().replace(/^[?#&]/, '');

		if (!input) {
			return ret;
		}

		for (const param of input.split('&')) {
			let [key, value] = splitOnFirst(options.decode ? param.replace(/\+/g, ' ') : param, '=');

			// Missing `=` should be `null`:
			// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
			value = value === undefined ? null : ['comma', 'separator'].includes(options.arrayFormat) ? value : decode(value, options);
			formatter(decode(key, options), value, ret);
		}

		for (const key of Object.keys(ret)) {
			const value = ret[key];
			if (typeof value === 'object' && value !== null) {
				for (const k of Object.keys(value)) {
					value[k] = parseValue(value[k], options);
				}
			} else {
				ret[key] = parseValue(value, options);
			}
		}

		if (options.sort === false) {
			return ret;
		}

		return (options.sort === true ? Object.keys(ret).sort() : Object.keys(ret).sort(options.sort)).reduce((result, key) => {
			const value = ret[key];
			if (Boolean(value) && typeof value === 'object' && !Array.isArray(value)) {
				// Sort object keys, not values
				result[key] = keysSorter(value);
			} else {
				result[key] = value;
			}

			return result;
		}, Object.create(null));
	}

	exports.extract = extract;
	exports.parse = parse;

	exports.stringify = (object, options) => {
		if (!object) {
			return '';
		}

		options = Object.assign({
			encode: true,
			strict: true,
			arrayFormat: 'none',
			arrayFormatSeparator: ','
		}, options);

		validateArrayFormatSeparator(options.arrayFormatSeparator);

		const shouldFilter = key => (
			(options.skipNull && isNullOrUndefined(object[key])) ||
			(options.skipEmptyString && object[key] === '')
		);

		const formatter = encoderForArrayFormat(options);

		const objectCopy = {};

		for (const key of Object.keys(object)) {
			if (!shouldFilter(key)) {
				objectCopy[key] = object[key];
			}
		}

		const keys = Object.keys(objectCopy);

		if (options.sort !== false) {
			keys.sort(options.sort);
		}

		return keys.map(key => {
			const value = object[key];

			if (value === undefined) {
				return '';
			}

			if (value === null) {
				return encode(key, options);
			}

			if (Array.isArray(value)) {
				return value
					.reduce(formatter(key), [])
					.join('&');
			}

			return encode(key, options) + '=' + encode(value, options);
		}).filter(x => x.length > 0).join('&');
	};

	exports.parseUrl = (input, options) => {
		options = Object.assign({
			decode: true
		}, options);

		const [url, hash] = splitOnFirst(input, '#');

		return Object.assign(
			{
				url: url.split('?')[0] || '',
				query: parse(extract(input), options)
			},
			options && options.parseFragmentIdentifier && hash ? {fragmentIdentifier: decode(hash, options)} : {}
		);
	};

	exports.stringifyUrl = (input, options) => {
		options = Object.assign({
			encode: true,
			strict: true
		}, options);

		const url = removeHash(input.url).split('?')[0] || '';
		const queryFromUrl = exports.extract(input.url);
		const parsedQueryFromUrl = exports.parse(queryFromUrl, {sort: false});

		const query = Object.assign(parsedQueryFromUrl, input.query);
		let queryString = exports.stringify(query, options);
		if (queryString) {
			queryString = `?${queryString}`;
		}

		let hash = getHash(input.url);
		if (input.fragmentIdentifier) {
			hash = `#${encode(input.fragmentIdentifier, options)}`;
		}

		return `${url}${queryString}${hash}`;
	};
	});
	var queryString_1 = queryString.extract;
	var queryString_2 = queryString.parse;
	var queryString_3 = queryString.stringify;
	var queryString_4 = queryString.parseUrl;
	var queryString_5 = queryString.stringifyUrl;

	var UrlParser_1 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });

	var query_string_1 = tslib_es6.__importDefault(queryString);
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
	        var maxDepth = Math.max.apply(Math, tslib_es6.__spread(depths));
	        var currentMatched = matchedRoutes.find(function (route) { return route.nestingDepth === maxDepth; });
	        var _b = tslib_es6.__read(url.split('?'), 2), pathString = _b[0], queryString = _b[1];
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

	});

	unwrapExports(UrlParser_1);

	var SilentModeService_1 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });

	var SilentModeService = /** @class */ (function () {
	    function SilentModeService(firstRoute) {
	        this.history = [];
	        this.currentHistoryPosition = 0;
	        this.appendHistory(firstRoute);
	    }
	    SilentModeService.prototype.appendHistory = function (data) {
	        var _a;
	        if (Array.isArray(data)) {
	            (_a = this.history).push.apply(_a, tslib_es6.__spread(data));
	            this.currentHistoryPosition += data.length;
	        }
	        else {
	            this.history.push(data);
	            this.currentHistoryPosition++;
	        }
	    };
	    SilentModeService.prototype.back = function () {
	        return this.go(-1);
	    };
	    SilentModeService.prototype.go = function (howFar) {
	        var _a, _b;
	        var goResult = this.currentHistoryPosition + howFar;
	        var previousObject = this.history[goResult];
	        if (previousObject) {
	            this.currentHistoryPosition = goResult;
	            return (_a = previousObject === null || previousObject === void 0 ? void 0 : previousObject.fullPath) !== null && _a !== void 0 ? _a : '';
	        }
	        return (_b = this.history[0].fullPath) !== null && _b !== void 0 ? _b : '';
	    };
	    return SilentModeService;
	}());
	exports.default = SilentModeService;

	});

	unwrapExports(SilentModeService_1);

	var Router_1 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });

	var PathService_1$1 = tslib_es6.__importDefault(PathService_1);
	var HashParser_1 = tslib_es6.__importDefault(HashParser);
	var Observable_1$1 = tslib_es6.__importDefault(Observable_1);
	var UrlParser_1$1 = tslib_es6.__importDefault(UrlParser_1);
	var SilentModeService_1$1 = tslib_es6.__importDefault(SilentModeService_1);
	var Router = /** @class */ (function () {
	    function Router(settings) {
	        var _this = this;
	        this.settings = settings;
	        this.pathService = new PathService_1$1.default();
	        this.routes = [];
	        this.parser = null;
	        this.ignoreEvents = false;
	        this.silentControl = null;
	        this.beforeEach = null;
	        this.afterEach = null;
	        this.currentMatched = new Observable_1$1.default([]);
	        this.currentRouteData = new Observable_1$1.default({
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
	                        ? _this.parseRoute(PathService_1$1.default.stripBase(ev.state.url, _this.base), false)
	                        : _this.parseRoute('/', false);
	                });
	                break;
	            case 'hash':
	            default:
	                this.parser = new HashParser_1.default(this.routes);
	                this.parseRoute(PathService_1$1.default.stripBase(window.location.hash, this.base) || '/');
	                window.addEventListener('hashchange', function () {
	                    if (_this.ignoreEvents) {
	                        _this.ignoreEvents = false;
	                        return;
	                    }
	                    _this.parseRoute(PathService_1$1.default.stripBase(window.location.hash, _this.base));
	                });
	                break;
	        }
	    };
	    Router.prototype.getTo = function (matched, url) {
	        var depths = matched.map(function (route) { return route.nestingDepth; });
	        var maxDepth = Math.max.apply(Math, tslib_es6.__spread(depths));
	        var currentRoute = matched.find(function (route) { return route.nestingDepth === maxDepth; });
	        if (!currentRoute)
	            return {
	                params: {},
	                query: {}
	            };
	        return Object.freeze(UrlParser_1$1.default.createRouteObject([currentRoute], url));
	    };
	    Router.prototype.getFrom = function () {
	        if (!this.currentMatched.getValue)
	            return {
	                params: {},
	                query: {}
	            };
	        var current = this.currentMatched.getValue;
	        var depths = current.map(function (route) { return route.nestingDepth; });
	        var maxDepth = Math.max.apply(Math, tslib_es6.__spread(depths));
	        var currentRoute = current.find(function (route) { return route.nestingDepth === maxDepth; });
	        if (!currentRoute)
	            return {
	                params: {},
	                query: {}
	            };
	        var url = this.currentRouteData.getValue.fullPath;
	        return Object.freeze(UrlParser_1$1.default.createRouteObject([currentRoute], url));
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
	        return tslib_es6.__awaiter(this, void 0, void 0, function () {
	            var matched, to, from, allowNext;
	            return tslib_es6.__generator(this, function (_b) {
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
	                            this.silentControl = new SilentModeService_1$1.default(to);
	                        }
	                        if (this.silentControl && doPushState) {
	                            this.silentControl.appendHistory(to);
	                        }
	                        return [4 /*yield*/, this.beforeHook(to, from)];
	                    case 1:
	                        allowNext = _b.sent();
	                        if (!allowNext)
	                            return [2 /*return*/];
	                        this.changeUrl(PathService_1$1.default.constructUrl(url, this.base), doPushState);
	                        this.currentRouteData.setValue(to);
	                        this.currentMatched.setValue(matched);
	                        this.afterHook(to, from);
	                        return [2 /*return*/];
	                }
	            });
	        });
	    };
	    Router.prototype.navigate = function (url) {
	        return tslib_es6.__awaiter(this, void 0, void 0, function () {
	            return tslib_es6.__generator(this, function (_a) {
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
	        return tslib_es6.__awaiter(this, void 0, void 0, function () {
	            var _this = this;
	            return tslib_es6.__generator(this, function (_a) {
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
	        return tslib_es6.__awaiter(this, void 0, void 0, function () {
	            return tslib_es6.__generator(this, function (_a) {
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

	});

	unwrapExports(Router_1);

	var src = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });

	var Router_1$1 = tslib_es6.__importDefault(Router_1);
	exports.default = Router_1$1.default;

	});

	var index = unwrapExports(src);

	return index;

})));
