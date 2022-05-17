import { Socket } from 'socket.io';
export declare type Coordinates = {
    lat: number;
    lng: number;
};
export declare enum Page {
    LOGIN = "",
    WORLD = "world",
    ENCOUNTER = "encounter"
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
    sightRange: number;
    speed: number;
    charactersInSight: CharacterInSight[];
    characterSightFlag: boolean;
    encountersInSight: EncounterInSight[];
    encounterSightFlag: boolean;
    socket: Socket;
}
export declare type EncounterParticipant = {
    characterId: string;
    nickname: string;
};
export interface Encounter {
    encounterId: string;
    participants: EncounterParticipant[];
    coordinates: Coordinates;
    encounterStartTime: number | null;
}
export declare type EncounterInSight = {
    coordinates: Coordinates;
    encounterId: string;
    participants: EncounterParticipant[];
    distance: number;
};
export declare type CharacterInSight = {
    characterId: string;
    coordinates: Coordinates;
    nickname: string;
    distance: number;
};
export declare const DEFAULT_COORDINATES: Coordinates;
