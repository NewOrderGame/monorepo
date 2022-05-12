export declare type User = {
    username: string;
};
export declare type CharacterInSight = {
    coordinates: {
        lat: number;
        lng: number;
    };
    username: string;
    userId: string;
    distance: number;
};
export declare type Character = {
    username: string;
    userId: string;
    sessionId: string;
    coordinates: {
        lat: number;
        lng: number;
    };
    movesTo: {
        lat: number;
        lng: number;
    } | null;
    sightDistance: number;
    speed: number;
    charactersInSight: CharacterInSight[];
};
export declare const DEFAULT_COORDINATES: {
    lat: number;
    lng: number;
};
