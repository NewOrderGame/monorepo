export type User = {
  username: string;
};

export type CharacterInSight = {
  coordinates: { lat: number; lng: number };
  username: string;
  userId: string;
};

export type Character = {
  username: string;
  userId: string;
  sessionId: string;
  coordinates: { lat: number; lng: number };
  movesTo: { lat: number; lng: number } | null;
  sightDistance: number; // m
  speed: number; // m/s
  charactersInSight: CharacterInSight[];
};

export const DEFAULT_COORDINATES = {lat: 46.47705630400258, lng: 30.730369681615272};