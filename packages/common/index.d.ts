export declare type Coordinates = {
    lat: number;
    lng: number;
};
export declare type NogPlayerId = string;
export declare type NogEncounterId = string;
export declare enum NogPage {
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
    sessionId: NogPlayerId;
    nickname: string;
    connected: boolean;
    coordinates: Coordinates;
    encounterId: NogEncounterId | null;
    encounterEndTime: number | null;
    encounterStartTime: number | null;
    page: NogPage;
}
export interface Character {
    characterId: NogPlayerId;
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
    encounterId: NogEncounterId;
    participants: EncounterParticipant[];
    coordinates: Coordinates;
    encounterStartTime: number | null;
}
export declare type EncounterParticipant = {
    characterId: NogPlayerId;
    nickname: string;
};
export declare type EncounterInSight = {
    coordinates: Coordinates;
    encounterId: NogEncounterId;
    participants: EncounterParticipant[];
    distance: number;
};
export declare type CharacterInSight = {
    characterId: NogPlayerId;
    coordinates: Coordinates;
    nickname: string;
    distance: number;
};
export declare const DEFAULT_COORDINATES: Coordinates;
