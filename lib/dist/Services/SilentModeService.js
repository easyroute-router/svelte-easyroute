"use strict";
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
            (_a = this.history).push.apply(_a, data);
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
