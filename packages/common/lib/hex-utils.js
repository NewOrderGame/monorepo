"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateLine = exports.calculateDistance = void 0;
var cubic_hex_1 = require("./cubic-hex");
var calculateDistance = function (hexA, hexB) {
    var vX = Math.abs(hexA.getX() - hexB.getX());
    var vY = Math.abs(hexA.getY() - hexB.getY());
    var vZ = Math.abs(hexA.getZ() - hexB.getZ());
    return Math.max(vX, vY, vZ);
};
exports.calculateDistance = calculateDistance;
var calculateLine = function (hexA, hexB) {
    var distance = (0, exports.calculateDistance)(hexA, hexB);
    var line = [];
    for (var i = 0; i <= distance; i++) {
        var multiplier = i / distance;
        var x = Math.round(hexA.getX() + (hexB.getX() - hexA.getX()) * multiplier);
        var y = Math.round(hexA.getY() + (hexB.getY() - hexA.getY()) * multiplier);
        var z = Math.round(hexA.getZ() + (hexB.getZ() - hexA.getZ()) * multiplier);
        line.push(new cubic_hex_1.CubicHex(x, y, z));
    }
    return line;
};
exports.calculateLine = calculateLine;
