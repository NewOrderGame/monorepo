"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cell = void 0;
var Cell = /** @class */ (function () {
    function Cell(x, y, options) {
        this.x = x;
        this.y = y;
        this.isWall = options.isWall || false;
    }
    return Cell;
}());
exports.Cell = Cell;
