import { Socket } from 'socket.io';

export type Coordinates = { lat: number; lng: number };

export enum Page {
  LOGIN = '',
  WORLD = 'world',
  ENCOUNTER = 'encounter'
}

export interface Session {
  sessionId: string;
  nickname: string;
  connected: boolean;
  coordinates: Coordinates;
  encounterId: string | null;
  encounterEndTime: number | null;
  page: Page;
}

export interface Character {
  characterId: string;
  nickname: string;
  coordinates: Coordinates;
  movesTo: Coordinates | null;
  sightRange: number; // m
  speed: number; // m/s
  charactersInSight: CharacterInSight[];
  characterSightFlag: boolean;
  encountersInSight: EncounterInSight[];
  encounterSightFlag: boolean;
  socket: Socket;
}

export type EncounterParticipant = {
  characterId: string;
  nickname: string;
};

export interface Encounter {
  encounterId: string;
  participants: EncounterParticipant[];
  coordinates: Coordinates;
}

export type EncounterInSight = {
  coordinates: Coordinates;
  encounterId: string;
  participants: EncounterParticipant[];
  distance: number;
};

export type CharacterInSight = {
  characterId: string;
  coordinates: Coordinates;
  nickname: string;
  distance: number;
};

export const DEFAULT_COORDINATES: Coordinates = {
  lat: 46.47705630400258,
  lng: 30.730369681615272
};
