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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Building = void 0;
var cell_1 = require("./cell");
var hex_utils_1 = require("./hex-utils");
var cubic_hex_1 = require("./cubic-hex");
var Building = /** @class */ (function () {
    function Building(id, plainBuildingNodes) {
        var _a;
        this.id = id;
        this.maxX = Math.max.apply(Math, __spreadArray([], __read(plainBuildingNodes.map(function (node) { return node.x; })), false));
        this.maxY = Math.max.apply(Math, __spreadArray([], __read(plainBuildingNodes.map(function (node) { return node.y; })), false));
        var wallNodesMap = this.collectWallNodesMap(plainBuildingNodes);
        this.map = [];
        for (var x = 0; x < this.maxX + 1; x++) {
            if (!this.map[x])
                this.map[x] = [];
            for (var y = 0; y < this.maxY + 1; y++) {
                this.map[x][y] = new cell_1.Cell(x, y, { isWall: !!((_a = wallNodesMap[x]) === null || _a === void 0 ? void 0 : _a[y]) });
            }
        }
    }
    Building.prototype.getMap = function () {
        return this.map;
    };
    Building.prototype.getCell = function (x, y) {
        if (x > this.maxX || y > this.maxY)
            throw new Error('The cell is out of boundaries');
        return this.map[x][y];
    };
    Building.prototype.collectWallNodesMap = function (plainBuildingNodes) {
        return plainBuildingNodes.reduce(function (a, currentNode, index, array) {
            if (index === array.length - 1)
                return a;
            var line = (0, hex_utils_1.calculateLine)(new cubic_hex_1.CubicHex(currentNode.x, currentNode.y), new cubic_hex_1.CubicHex(array[index + 1].x, array[index + 1].y));
            line.forEach(function (hex) {
                var x = hex.toAxial().getX();
                var y = hex.toAxial().getY();
                if (!a[x]) {
                    a[x] = [];
                }
                a[x][y] = true;
            });
            return a;
        }, []);
    };
    return Building;
}());
exports.Building = Building;
