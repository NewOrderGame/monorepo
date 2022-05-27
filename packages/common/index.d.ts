export declare type Coordinates = {
    lat: number;
    lng: number;
};
export declare type PlayerId = string;
export declare enum Page {
    ROOT = "",
    WORLD = "world",
    ENCOUNTER = "encounter"
}
export declare enum NogNamespace {
    AUTH = "auth",
    WORLD = "world",
    ENCOUNTER = "encounter"
}
export declare enum NogEvent {
    CONNECTION = "connection",
    CONNECT = "connect",
    DISCONNECT = "disconnect",
    INIT = "init",
    DESTROY = "destroy",
    REDIRECT = "redirect",
    MOVE = "move",
    EXIT = "exit",
    ENCOUNTERS_IN_SIGHT = "encounters-in-sight",
    CHARACTERS_IN_SIGHT = "characters-in-sight"
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
}
export interface Encounter {
    encounterId: string;
    participants: EncounterParticipant[];
    coordinates: Coordinates;
    encounterStartTime: number | null;
}
export declare type EncounterParticipant = {
    characterId: string;
    nickname: string;
};
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
