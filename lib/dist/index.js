"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Router_1 = __importDefault(require("./Router/Router"));
exports.default = Router_1.default;
var RouterOutlet_svelte_1 = require("../svelte-components/RouterOutlet.svelte");
Object.defineProperty(exports, "RouterOutlet", { enumerable: true, get: function () { return RouterOutlet_svelte_1.default; } });
var RouterLink_svelte_1 = require("../svelte-components/RouterLink.svelte");
Object.defineProperty(exports, "RouterLink", { enumerable: true, get: function () { return RouterLink_svelte_1.default; } });
