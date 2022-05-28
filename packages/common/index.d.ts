export declare type Coordinates = {
    lat: number;
    lng: number;
};
export declare type NogCharacterId = string;
export declare type NogEncounterId = string;
export declare enum NogPage {
    ROOT = "",
    CHARACTER = "character",
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
export declare type Outlook = number[];
export declare type CharacterStats = {
    speed: number;
    sightRange: number;
    outlook: Outlook;
};
export interface Character {
    characterId: NogCharacterId;
    nickname: string;
    connected: boolean;
    coordinates: Coordinates;
    encounterId: NogEncounterId | null;
    encounterEndTime: number | null;
    encounterStartTime: number | null;
    page: NogPage;
}
export interface Encounter {
    encounterId: NogEncounterId;
    participants: EncounterParticipant[];
    coordinates: Coordinates;
    encounterStartTime: number | null;
}
export interface CharacterAtWorld {
    characterId: NogCharacterId;
    nickname: string;
    coordinates: Coordinates;
    movesTo: Coordinates | null;
    stats: CharacterStats;
    charactersInSight: CharacterInSight[];
    characterSightFlag: boolean;
    encountersInSight: EncounterInSight[];
    encounterSightFlag: boolean;
}
export declare type EncounterParticipant = {
    characterId: NogCharacterId;
    nickname: string;
};
export declare type EncounterInSight = {
    coordinates: Coordinates;
    encounterId: NogEncounterId;
    participants: EncounterParticipant[];
    distance: number;
};
export declare type CharacterInSight = {
    characterId: NogCharacterId;
    coordinates: Coordinates;
    nickname: string;
    distance: number;
};
export declare const DEFAULT_COORDINATES: Coordinates;
