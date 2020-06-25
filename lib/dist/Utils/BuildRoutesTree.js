"use strict";
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
