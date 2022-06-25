import { NogPage } from './enums';
export declare type Coordinates = {
    lat: number;
    lng: number;
};
export declare type NogCharacterId = string;
export declare type NogEncounterId = string;
export declare type Outlook = {
    0: number;
    1: number;
    2: number;
};
export declare type CharacterStats = {
    speed: number;
    sightRange: number;
    outlook: Outlook;
};
export declare type Character = {
    characterId: NogCharacterId;
    nickname: string;
    connected: boolean;
    coordinates: Coordinates;
    encounterId: NogEncounterId | null;
    encounterEndTime: number | null;
    encounterStartTime: number | null;
    page: NogPage;
    stats: CharacterStats;
};
export declare type Encounter = {
    encounterId: NogEncounterId;
    participants: EncounterParticipant[];
    coordinates: Coordinates;
    encounterStartTime: number | null;
};
export declare type CharacterAtWorld = {
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
};
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
