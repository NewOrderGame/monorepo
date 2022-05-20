import { Socket } from 'socket.io';

export type Coordinates = { lat: number; lng: number };

export enum Page {
  ROOT = '',
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
  DISCONNECT = 'disconnect',
  INIT = 'init',
  DESTROY = 'destroy',
  REDIRECT = 'redirect',
  MOVE = 'move',
  EXIT = 'exit',
  ENCOUNTERS_IN_SIGHT = 'encounters-in-sight',
  CHARACTERS_IN_SIGHT = 'characters-in-sight'
}

export interface Session {
  sessionId: string;
  nickname: string;
  connected: boolean;
  coordinates: Coordinates;
  encounterId: string | null;
  encounterEndTime: number | null;
  encounterStartTime: number | null;
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

export interface Encounter {
  encounterId: string;
  participants: EncounterParticipant[];
  coordinates: Coordinates;
  encounterStartTime: number | null;
}

export type EncounterParticipant = {
  characterId: string;
  nickname: string;
};

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
