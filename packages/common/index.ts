export type Coordinates = { lat: number; lng: number };

export type NogCharacterId = string;
export type NogEncounterId = string;

export enum NogPage {
  ROOT = '',
  CHARACTER = 'character',
  WORLD = 'world',
  ENCOUNTER = 'encounter'
}

export enum NogNamespace {
  AUTH = 'auth',
  WORLD = 'world',
  ENCOUNTER = 'encounter'
}

export enum NogEvent {
  CONNECTION = 'connection',
  CONNECT = 'connect',
  CONNECTED = 'connected',
  DISCONNECT = 'disconnect',
  REDIRECT = 'redirect',
  ENCOUNTERS_IN_SIGHT = 'encounters-in-sight',
  CHARACTERS_IN_SIGHT = 'characters-in-sight',
  CREATE_CHARACTER = 'create-character',
  INIT_CHARACTER_AT_WORLD = 'create-character-at-world',
  DESTROY_CHARACTER_AT_WORLD = 'destroy-character-at-world',
  MOVE_CHARACTER_AT_WORLD = 'move-character-at-world',
  INIT_ENCOUNTER = 'init-encounter',
  EXIT_ENCOUNTER = 'exit-encounter',
  DESTROY_ENCOUNTER = 'destroy-encounter',
  INIT_NPC = 'init-npc',
}

export type Outlook = number[];

export type CharacterStats = {
  speed: number; // m/s
  sightRange: number; // m
  outlook: Outlook;
};

export interface Character {
  characterId: NogCharacterId;
  nickname: string;
  connected: boolean;
  coordinates: Coordinates;
  encounterId: NogEncounterId | null;
  encounterEndTime: number | null;
  encounterStartTime: number | null;
  page: NogPage;
  stats: CharacterStats;
}

export interface Encounter {
  encounterId: NogEncounterId;
  participants: EncounterParticipant[];
  coordinates: Coordinates;
  encounterStartTime: number | null;
}

export interface CharacterAtWorld {
  characterId: NogCharacterId;
  nickname: string;
  coordinates: Coordinates;
  movesTo: Coordinates | null;
  charactersInSight: CharacterInSight[];
  characterSightFlag: boolean;
  encountersInSight: EncounterInSight[];
  encounterSightFlag: boolean;
  stats: CharacterStats;
  isNpc: boolean;
}

export type EncounterParticipant = {
  characterId: NogCharacterId;
  nickname: string;
};

export type EncounterInSight = {
  coordinates: Coordinates;
  encounterId: NogEncounterId;
  participants: EncounterParticipant[];
  distance: number;
};

export type CharacterInSight = {
  characterId: NogCharacterId;
  coordinates: Coordinates;
  nickname: string;
  distance: number;
  isEnemy: boolean;
};

export const DEFAULT_COORDINATES: Coordinates = {
  lat: 46.47705630400258,
  lng: 30.730369681615272
};
