import { boolean, number, object, string } from 'yup';

export const characterIdSchema = string();

export const coordinatesSchema = object({
  lat: string(),
  lng: number()
});

export const characterInSightSchema = object({
  characterId: characterIdSchema,
  coordinates: coordinatesSchema,
  nickname: string(),
  distance: number(),
  isEnemy: boolean()
});

export const characterAtWorldSchema = object({
  characterId: characterIdSchema,
  nickname: string(),
  coordinates: coordinatesSchema,
  movesTo: coordinatesSchema.nullable(),
  charactersInSight: characterInSightSchema,
  characterSightFlag: boolean(),
  encountersInSight: object(),
  encounterSightFlag: boolean(),
  stats: object(),
  isNpc: boolean()
});
