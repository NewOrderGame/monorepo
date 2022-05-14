import { Socket } from 'socket.io';
export declare type Coordinates = {
    lat: number;
    lng: number;
};
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
    sightRange: number;
    speed: number;
    charactersInSight: CharacterInSight[];
    characterSightFlag: boolean;
    encountersInSight: EncounterInSight[];
    encounterSightFlag: boolean;
    socket: Socket;
}
declare type EncounterParticipant = {
    userId: string;
    username: string;
};
export interface Encounter {
    encounterId: string;
    participants: EncounterParticipant[];
    coordinates: Coordinates;
}
export declare type EncounterInSight = {
    coordinates: Coordinates;
    encounterId: string;
    participants: EncounterParticipant[];
    distance: number;
};
export declare type CharacterInSight = {
    coordinates: Coordinates;
    username: string;
    userId: string;
    distance: number;
};
export declare const DEFAULT_COORDINATES: Coordinates;
export declare function errorWithLogout(message: string, socket: Socket): Error;
export {};
