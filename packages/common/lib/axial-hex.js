"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AxialHex = void 0;
var schemas_1 = require("./schemas");
var cubic_hex_1 = require("./cubic-hex");
var AxialHex = /** @class */ (function () {
    function AxialHex(x, y, z) {
        schemas_1.hexXSchema.validateSync(x);
        schemas_1.hexYSchema.validateSync(y);
        schemas_1.hexZSchema.validateSync(z);
        if (typeof z === 'number') {
            this.x = -y;
            this.y = z;
        }
        else {
            this.x = x;
            this.y = y;
        }
    }
    AxialHex.prototype.toCubic = function () {
        return new cubic_hex_1.CubicHex(this.x, this.y);
    };
    AxialHex.prototype.getX = function () {
        return this.x;
    };
    AxialHex.prototype.getY = function () {
        return this.y;
    };
    return AxialHex;
}());
exports.AxialHex = AxialHex;
