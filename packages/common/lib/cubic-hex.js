"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CubicHex = void 0;
var axial_hex_1 = require("./axial-hex");
var schemas_1 = require("./schemas");
var CubicHex = /** @class */ (function () {
    function CubicHex(x, y, z) {
        schemas_1.hexXSchema.validateSync(x);
        schemas_1.hexYSchema.validateSync(y);
        schemas_1.hexZSchema.validateSync(z);
        if (typeof z === 'number') {
            this.x = x;
            this.y = y;
            this.z = z;
        }
        else {
            this.x = x - y;
            this.y = -x;
            this.z = y;
        }
    }
    CubicHex.prototype.toAxial = function () {
        return new axial_hex_1.AxialHex(this.x, this.y, this.z);
    };
    CubicHex.prototype.getX = function () {
        return this.x;
    };
    CubicHex.prototype.getY = function () {
        return this.y;
    };
    CubicHex.prototype.getZ = function () {
        return this.z;
    };
    return CubicHex;
}());
exports.CubicHex = CubicHex;
