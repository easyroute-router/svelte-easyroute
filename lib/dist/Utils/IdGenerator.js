"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function generateId() {
    return Math.random().toString(36).substr(2, 9);
}
exports.default = generateId;
