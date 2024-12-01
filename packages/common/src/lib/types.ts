import { NogPage } from './enums';

export type GeoCoordinates = { lat: number; lng: number };

export type NogCharacterId = string;

export type NogEncounterId = string;

export type NogBuildingId = number;

export type Outlook = {
  0: number;
  1: number;
  2: number;
};

export type CharacterStats = {
  speed: number; // m/s
  sightRange: number; // m
  outlook: Outlook;
};

export type Character = {
  characterId: NogCharacterId;
  nickname: string;
  connected: boolean;
  coordinates: GeoCoordinates;
  encounterId: NogEncounterId | null;
  encounterEndTime: number | null;
  page: NogPage;
  stats: CharacterStats;
  buildingId: number | null;
};

export type Encounter = {
  encounterId: NogEncounterId;
  // startTime: number;
  participants: EncounterParticipant[];
  coordinates: GeoCoordinates;
  buildingId: NogBuildingId | null;
  // units: Unit[];
  // weather: Weather;
};

export type CharacterAtWorld = {
  characterId: NogCharacterId;
  nickname: string;
  coordinates: GeoCoordinates;
  movesTo: GeoCoordinates | null;
  charactersInSight: CharacterInSight[];
  characterSightFlag: boolean;
  encountersInSight: EncounterInSight[];
  encounterSightFlag: boolean;
  stats: CharacterStats;
};

export type EncounterParticipant = {
  characterId: NogCharacterId;
  nickname: string;
};

export type EncounterInSight = {
  coordinates: GeoCoordinates;
  encounterId: NogEncounterId;
  participants: EncounterParticipant[];
  distance: number;
};

export type CharacterInSight = {
  characterId: NogCharacterId;
  coordinates: GeoCoordinates;
  nickname: string;
  distance: number;
  isEnemy: boolean;
};

export type OverpassElement = { type: string; id: number };

export type WayOverpassElement = {
  bounds: number[];
  nodes: number[];
  geometry: { lat: number; lon: number }[];
} & OverpassElement;
