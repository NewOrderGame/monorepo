"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.characterAtWorldSchema = exports.characterInSightSchema = exports.coordinatesSchema = exports.characterIdSchema = void 0;
var yup_1 = require("yup");
exports.characterIdSchema = (0, yup_1.string)();
exports.coordinatesSchema = (0, yup_1.object)({
    lat: (0, yup_1.string)(),
    lng: (0, yup_1.number)()
});
exports.characterInSightSchema = (0, yup_1.object)({
    characterId: exports.characterIdSchema,
    coordinates: exports.coordinatesSchema,
    nickname: (0, yup_1.string)(),
    distance: (0, yup_1.number)(),
    isEnemy: (0, yup_1.boolean)()
});
exports.characterAtWorldSchema = (0, yup_1.object)({
    characterId: exports.characterIdSchema,
    nickname: (0, yup_1.string)(),
    coordinates: exports.coordinatesSchema,
    movesTo: exports.coordinatesSchema.nullable(),
    charactersInSight: exports.characterInSightSchema,
    characterSightFlag: (0, yup_1.boolean)(),
    encountersInSight: (0, yup_1.object)(),
    encounterSightFlag: (0, yup_1.boolean)(),
    stats: (0, yup_1.object)(),
    isNpc: (0, yup_1.boolean)()
});
