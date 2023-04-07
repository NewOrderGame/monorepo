"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CubicHex = void 0;
var schemas_1 = require("./schemas");
var mathjs_1 = require("mathjs");
var CubicHex = /** @class */ (function () {
    function CubicHex(x, y, z) {
        schemas_1.hexXSchema.validateSync(x);
        schemas_1.hexYSchema.validateSync(y);
        schemas_1.hexZSchema.validateSync(z);
        if (typeof z === 'number') {
            this.x = mathjs_1.evaluate("" + x);
            this.y = mathjs_1.evaluate("" + y);
            this.z = mathjs_1.evaluate("" + z);
        }
        else {
            this.x = mathjs_1.evaluate("" + x);
            this.y = mathjs_1.evaluate("" + -y);
            this.z = mathjs_1.evaluate("" + (y - x));
        }
    }
    CubicHex.prototype.toMapCoordinates = function () {
        return {
            x: this.x,
            y: -this.y
        };
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
//# sourceMappingURL=cubic-hex.js.map