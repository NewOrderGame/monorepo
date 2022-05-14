import { Socket } from 'socket.io';

export type Coordinates = { lat: number; lng: number };

export interface Session {
  sessionId: string;
  userId: string;
  username: string;
  connected: boolean;
  coordinates: Coordinates;
  page: string;
}

export interface Character {
  userId: string;
  username: string;
  sessionId: string;
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

type EncounterParticipant = {
  userId: string;
  username: string;
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
  coordinates: Coordinates;
  username: string;
  userId: string;
  distance: number;
};

export const DEFAULT_COORDINATES: Coordinates = {
  lat: 46.47705630400258,
  lng: 30.730369681615272
};

export function errorWithLogout(message: string, socket: Socket): Error {
  const error = new Error(message);
  socket.emit('logout');
  socket.disconnect();
  console.error(error);
  return Error();
}
