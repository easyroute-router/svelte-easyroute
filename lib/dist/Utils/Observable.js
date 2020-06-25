"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var IdGenerator_1 = __importDefault(require("./IdGenerator"));
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
