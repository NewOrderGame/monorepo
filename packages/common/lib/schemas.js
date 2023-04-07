"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hexZSchema = exports.hexYSchema = exports.hexXSchema = exports.characterAtWorldSchema = exports.encounterInSightSchema = exports.characterInSightSchema = exports.encounterParticipantSchema = exports.characterStatsSchema = exports.outlookSchema = exports.coordinatesSchema = exports.nicknameSchema = exports.encounterIdSchema = exports.characterIdSchema = exports.booleanSchema = exports.stringSchema = exports.numberSchema = void 0;
var yup_1 = require("yup");
exports.numberSchema = yup_1.number();
exports.stringSchema = yup_1.string();
exports.booleanSchema = yup_1.boolean();
exports.characterIdSchema = yup_1.string();
exports.encounterIdSchema = yup_1.string();
exports.nicknameSchema = yup_1.string();
exports.coordinatesSchema = yup_1.object({
    lat: yup_1.string(),
    lng: yup_1.number()
});
exports.outlookSchema = yup_1.object({
    0: yup_1.number().min(-100).max(100),
    1: yup_1.number().min(-100).max(100),
    2: yup_1.number().min(-100).max(100)
});
exports.characterStatsSchema = yup_1.object({
    outlook: exports.outlookSchema,
    speed: yup_1.number(),
    sightRange: yup_1.number()
});
exports.encounterParticipantSchema = yup_1.object({
    characterId: exports.characterIdSchema,
    nickname: exports.nicknameSchema
});
exports.characterInSightSchema = yup_1.object({
    characterId: exports.characterIdSchema,
    coordinates: exports.coordinatesSchema,
    nickname: exports.nicknameSchema,
    distance: yup_1.number(),
    isEnemy: yup_1.boolean()
});
exports.encounterInSightSchema = yup_1.object({
    coordinates: exports.coordinatesSchema,
    encounterId: exports.encounterIdSchema,
    participants: yup_1.array(exports.encounterParticipantSchema),
    distance: yup_1.number()
});
exports.characterAtWorldSchema = yup_1.object({
    characterId: exports.characterIdSchema,
    nickname: exports.nicknameSchema,
    stats: exports.characterStatsSchema,
    coordinates: exports.coordinatesSchema,
    movesTo: exports.coordinatesSchema.nullable(),
    charactersInSight: exports.characterInSightSchema.nullable(),
    characterSightFlag: yup_1.boolean(),
    encountersInSight: yup_1.array(exports.encounterInSightSchema).nullable(),
    encounterSightFlag: yup_1.boolean(),
    isNpc: yup_1.boolean()
});
exports.hexXSchema = yup_1.number();
exports.hexYSchema = yup_1.number();
exports.hexZSchema = yup_1.number().nullable(true);
//# sourceMappingURL=schemas.js.map