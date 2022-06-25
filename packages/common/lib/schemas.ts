import { array, boolean, number, object, string } from 'yup';

export const numberSchema = number();
export const stringSchema = string();
export const booleanSchema = boolean();

export const characterIdSchema = string();

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
  speed: number(),
  sightRange: number(),
  outlook: outlookSchema
});

export const encounterParticipantSchema = object({
  characterId: characterIdSchema,
  nickname: string()
});

export const characterInSightSchema = object({
  characterId: characterIdSchema,
  coordinates: coordinatesSchema,
  nickname: string(),
  distance: number(),
  isEnemy: boolean()
});

export const encounterInSightSchema = object({
  coordinates: coordinatesSchema,
  encounterId: numberSchema,
  participants: array(encounterParticipantSchema),
  distance: number()
});

export const characterAtWorldSchema = object({
  characterId: characterIdSchema,
  nickname: string(),
  coordinates: coordinatesSchema,
  movesTo: coordinatesSchema.nullable(),
  charactersInSight: characterInSightSchema.nullable(),
  characterSightFlag: boolean(),
  encountersInSight: array(encounterInSightSchema).nullable(),
  encounterSightFlag: boolean(),
  stats: characterStatsSchema,
  isNpc: boolean()
});
