import { array, boolean, number, object, string } from 'yup';

export const numberSchema = number();
export const stringSchema = string();
export const booleanSchema = boolean();

export const characterIdSchema = string();
export const encounterIdSchema = string();
export const nicknameSchema = string();

export const coordinatesSchema = object({
  lat: string(),
  lng: number()
});

export const outlookSchema = object({
  0: number().min(-100).max(100),
  1: number().min(-100).max(100),
  2: number().min(-100).max(100)
});

export const characterStatsSchema = object({
  outlook: outlookSchema,
  speed: number(),
  sightRange: number()
});

export const encounterParticipantSchema = object({
  characterId: characterIdSchema,
  nickname: nicknameSchema
});

export const characterInSightSchema = object({
  characterId: characterIdSchema,
  coordinates: coordinatesSchema,
  nickname: nicknameSchema,
  distance: number(),
  isEnemy: boolean()
});

export const encounterInSightSchema = object({
  coordinates: coordinatesSchema,
  encounterId: encounterIdSchema,
  participants: array(encounterParticipantSchema),
  distance: number()
});

export const characterAtWorldSchema = object({
  characterId: characterIdSchema,
  nickname: nicknameSchema,
  stats: characterStatsSchema,
  coordinates: coordinatesSchema,
  movesTo: coordinatesSchema.nullable(),
  charactersInSight: characterInSightSchema.nullable(),
  characterSightFlag: boolean(),
  encountersInSight: array(encounterInSightSchema).nullable(),
  encounterSightFlag: boolean(),
  isNpc: boolean()
});

export const hexXSchema = number();
export const hexYSchema = number();
export const hexZSchema = number().nullable(true);
