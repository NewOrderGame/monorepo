"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.characterAtWorldSchema = exports.encounterInSightSchema = exports.characterInSightSchema = exports.encounterParticipantSchema = exports.characterStatsSchema = exports.outlookSchema = exports.coordinatesSchema = exports.nicknameSchema = exports.encounterIdSchema = exports.characterIdSchema = exports.booleanSchema = exports.stringSchema = exports.numberSchema = void 0;
var yup_1 = require("yup");
exports.numberSchema = (0, yup_1.number)();
exports.stringSchema = (0, yup_1.string)();
exports.booleanSchema = (0, yup_1.boolean)();
exports.characterIdSchema = (0, yup_1.string)();
exports.encounterIdSchema = (0, yup_1.string)();
exports.nicknameSchema = (0, yup_1.string)();
exports.coordinatesSchema = (0, yup_1.object)({
    lat: (0, yup_1.string)(),
    lng: (0, yup_1.number)()
});
exports.outlookSchema = (0, yup_1.object)({
    0: (0, yup_1.number)().min(-100).max(100),
    1: (0, yup_1.number)().min(-100).max(100),
    2: (0, yup_1.number)().min(-100).max(100)
});
exports.characterStatsSchema = (0, yup_1.object)({
    outlook: exports.outlookSchema,
    speed: (0, yup_1.number)(),
    sightRange: (0, yup_1.number)()
});
exports.encounterParticipantSchema = (0, yup_1.object)({
    characterId: exports.characterIdSchema,
    nickname: exports.nicknameSchema
});
exports.characterInSightSchema = (0, yup_1.object)({
    characterId: exports.characterIdSchema,
    coordinates: exports.coordinatesSchema,
    nickname: exports.nicknameSchema,
    distance: (0, yup_1.number)(),
    isEnemy: (0, yup_1.boolean)()
});
exports.encounterInSightSchema = (0, yup_1.object)({
    coordinates: exports.coordinatesSchema,
    encounterId: exports.encounterIdSchema,
    participants: (0, yup_1.array)(exports.encounterParticipantSchema),
    distance: (0, yup_1.number)()
});
exports.characterAtWorldSchema = (0, yup_1.object)({
    characterId: exports.characterIdSchema,
    nickname: exports.nicknameSchema,
    stats: exports.characterStatsSchema,
    coordinates: exports.coordinatesSchema,
    movesTo: exports.coordinatesSchema.nullable(),
    charactersInSight: exports.characterInSightSchema.nullable(),
    characterSightFlag: (0, yup_1.boolean)(),
    encountersInSight: (0, yup_1.array)(exports.encounterInSightSchema).nullable(),
    encounterSightFlag: (0, yup_1.boolean)(),
    isNpc: (0, yup_1.boolean)()
});
