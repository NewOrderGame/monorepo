"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Building = void 0;
var cell_1 = require("./cell");
var Building = /** @class */ (function () {
    function Building(id, plainBuildingNodes) {
        var _a;
        this.id = id;
        this.maxX = Math.max.apply(Math, plainBuildingNodes.map(function (node) { return node.x; }));
        this.maxY = Math.max.apply(Math, plainBuildingNodes.map(function (node) { return node.y; }));
        var wallNodesMap = plainBuildingNodes.reduce(function (a, node) {
            if (!a[node.x])
                a[node.x] = [];
            a[node.x][node.y] = true;
            return a;
        }, []);
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
    return Building;
}());
exports.Building = Building;
