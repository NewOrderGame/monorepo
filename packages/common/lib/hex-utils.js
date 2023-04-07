"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.drawLine = exports.calculateDistance = void 0;
var cubic_hex_1 = require("./cubic-hex");
var mathjs_1 = require("mathjs");
exports.calculateDistance = function (hexA, hexB) {
    var vX = mathjs_1.abs(mathjs_1.subtract(hexA.getX(), hexB.getX()));
    var vY = mathjs_1.abs(mathjs_1.subtract(hexA.getY(), hexB.getY()));
    var vZ = mathjs_1.abs(mathjs_1.subtract(hexA.getZ(), hexB.getZ()));
    return mathjs_1.max(vX, vY, vZ);
};
exports.drawLine = function (hexA, hexB) {
    var distance = exports.calculateDistance(hexA, hexB);
    var line = [];
    for (var i = 0; i <= distance; i++) {
        var multiplier = mathjs_1.divide(i, distance);
        var x = mathjs_1.round(mathjs_1.evaluate("(" + hexA.getX() + " + (" + hexB.getX() + " - " + hexA.getX() + ") * " + multiplier + ")"));
        var z = mathjs_1.round(mathjs_1.evaluate("(" + hexA.getZ() + " + (" + hexB.getZ() + " - " + hexA.getZ() + ") * " + multiplier + ") - 0.001"));
        var y = mathjs_1.evaluate("-" + x + " -" + z);
        line.push(new cubic_hex_1.CubicHex(x, y, z));
    }
    return line;
};
//# sourceMappingURL=hex-utils.js.map