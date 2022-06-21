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
    CONNECTED = "connected",
    DISCONNECT = "disconnect",
    REDIRECT = "redirect",
    INIT_ENCOUNTER_PAGE = "init-encounter-page",
    INIT_WORLD_PAGE = "init-world-page",
    CREATE_CHARACTER = "create-character",
    MOVE_CHARACTER_AT_WORLD = "move-character-at-world",
    ENCOUNTERS_IN_SIGHT = "encounters-in-sight",
    CHARACTERS_IN_SIGHT = "characters-in-sight",
    INIT_NPC = "init-npc",
    DESTROY_NPC = "destroy-npc",
    EXIT_ENCOUNTER = "exit-encounter",
    MOVE_NPC_AT_WORLD = "move-npc-at-world",
    CREATE_NPC = "create-npc"
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
    stats: CharacterStats;
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
    charactersInSight: CharacterInSight[];
    characterSightFlag: boolean;
    encountersInSight: EncounterInSight[];
    encounterSightFlag: boolean;
    stats: CharacterStats;
    isNpc: boolean;
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
    isEnemy: boolean;
};
export declare const DEFAULT_COORDINATES: Coordinates;
