"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var IdGenerator_1 = __importDefault(require("./IdGenerator"));
function Observable(initValue) {
    var _object = {
        value: initValue
    };
    Object.defineProperties(_object, {
        getValue: {
            get: function () {
                return this.value;
            }
        },
        _subscribersQueue: {
            value: {},
            writable: true
        },
        subscribe: {
            value: function (listener) {
                var _this = this;
                var id = IdGenerator_1.default();
                this._subscribersQueue[id] = listener;
                return function () {
                    delete _this._subscribersQueue[id];
                };
            }
        },
        setValue: {
            value: function (newValue) {
                this.value = newValue;
                for (var key in this._subscribersQueue) {
                    var subscriber = this._subscribersQueue[key];
                    subscriber(this.value);
                }
            }
        }
    });
    return _object;
}
exports.default = Observable;
