import { NogPage } from './enums';

export type Coordinates = { lat: number; lng: number };

export type NogCharacterId = string;

export type NogEncounterId = string;

export type Outlook = number[];

export type CharacterStats = {
  speed: number; // m/s
  sightRange: number; // m
  outlook: Outlook;
};
export type Character = {
  characterId: NogCharacterId;
  nickname: string;
  connected: boolean;
  coordinates: Coordinates;
  encounterId: NogEncounterId | null;
  encounterEndTime: number | null;
  encounterStartTime: number | null;
  page: NogPage;
  stats: CharacterStats;
};

export type Encounter = {
  encounterId: NogEncounterId;
  participants: EncounterParticipant[];
  coordinates: Coordinates;
  encounterStartTime: number | null;
};

export type CharacterAtWorld = {
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
};

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
