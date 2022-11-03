"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.drawLine = exports.calculateDistance = void 0;
var cubic_hex_1 = require("./cubic-hex");
var mathjs_1 = require("mathjs");
var calculateDistance = function (hexA, hexB) {
    var vX = (0, mathjs_1.abs)((0, mathjs_1.subtract)(hexA.getX(), hexB.getX()));
    var vY = (0, mathjs_1.abs)((0, mathjs_1.subtract)(hexA.getY(), hexB.getY()));
    var vZ = (0, mathjs_1.abs)((0, mathjs_1.subtract)(hexA.getZ(), hexB.getZ()));
    return (0, mathjs_1.max)(vX, vY, vZ);
};
exports.calculateDistance = calculateDistance;
var drawLine = function (hexA, hexB) {
    var distance = (0, exports.calculateDistance)(hexA, hexB);
    var line = [];
    for (var i = 0; i <= distance; i++) {
        var multiplier = (0, mathjs_1.divide)(i, distance);
        var x = (0, mathjs_1.round)((0, mathjs_1.evaluate)("".concat(hexA.getX(), " + (").concat(hexB.getX(), " - ").concat(hexA.getX(), ") * ").concat(multiplier)));
        var z = (0, mathjs_1.round)((0, mathjs_1.evaluate)("".concat(hexA.getZ(), " + (").concat(hexB.getZ(), " - ").concat(hexA.getZ(), ") * ").concat(multiplier)));
        var y = (0, mathjs_1.evaluate)("-".concat(x, " -").concat(z));
        line.push(new cubic_hex_1.CubicHex(x, y, z));
    }
    return line;
};
exports.drawLine = drawLine;
