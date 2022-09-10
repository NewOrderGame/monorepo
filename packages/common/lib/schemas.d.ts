export declare const numberSchema: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
export declare const stringSchema: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
export declare const booleanSchema: import("yup").BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
export declare const characterIdSchema: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
export declare const encounterIdSchema: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
export declare const nicknameSchema: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
export declare const coordinatesSchema: import("yup/lib/object").OptionalObjectSchema<{
    lat: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
    lng: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
}, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
    lat: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
    lng: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
}>>;
export declare const outlookSchema: import("yup/lib/object").OptionalObjectSchema<{
    0: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    1: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    2: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
}, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
    0: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    1: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    2: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
}>>;
export declare const characterStatsSchema: import("yup/lib/object").OptionalObjectSchema<{
    outlook: import("yup/lib/object").OptionalObjectSchema<{
        0: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
        1: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
        2: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
        0: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
        1: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
        2: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    }>>;
    speed: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    sightRange: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
}, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
    outlook: import("yup/lib/object").OptionalObjectSchema<{
        0: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
        1: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
        2: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
        0: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
        1: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
        2: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    }>>;
    speed: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    sightRange: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
}>>;
export declare const encounterParticipantSchema: import("yup/lib/object").OptionalObjectSchema<{
    characterId: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
    nickname: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
}, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
    characterId: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
    nickname: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
}>>;
export declare const characterInSightSchema: import("yup/lib/object").OptionalObjectSchema<{
    characterId: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
    coordinates: import("yup/lib/object").OptionalObjectSchema<{
        lat: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
        lng: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
        lat: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
        lng: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    }>>;
    nickname: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
    distance: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    isEnemy: import("yup").BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
}, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
    characterId: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
    coordinates: import("yup/lib/object").OptionalObjectSchema<{
        lat: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
        lng: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
        lat: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
        lng: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    }>>;
    nickname: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
    distance: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    isEnemy: import("yup").BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
}>>;
export declare const encounterInSightSchema: import("yup/lib/object").OptionalObjectSchema<{
    coordinates: import("yup/lib/object").OptionalObjectSchema<{
        lat: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
        lng: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
        lat: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
        lng: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    }>>;
    encounterId: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
    participants: import("yup/lib/array").OptionalArraySchema<import("yup/lib/object").OptionalObjectSchema<{
        characterId: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
        nickname: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
    }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
        characterId: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
        nickname: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
    }>>, any, import("yup/lib/object").TypeOfShape<{
        characterId: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
        nickname: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
    }>[]>;
    distance: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
}, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
    coordinates: import("yup/lib/object").OptionalObjectSchema<{
        lat: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
        lng: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
        lat: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
        lng: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    }>>;
    encounterId: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
    participants: import("yup/lib/array").OptionalArraySchema<import("yup/lib/object").OptionalObjectSchema<{
        characterId: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
        nickname: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
    }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
        characterId: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
        nickname: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
    }>>, any, import("yup/lib/object").TypeOfShape<{
        characterId: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
        nickname: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
    }>[]>;
    distance: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
}>>;
export declare const characterAtWorldSchema: import("yup/lib/object").OptionalObjectSchema<{
    characterId: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
    nickname: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
    stats: import("yup/lib/object").OptionalObjectSchema<{
        outlook: import("yup/lib/object").OptionalObjectSchema<{
            0: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
            1: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
            2: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
        }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
            0: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
            1: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
            2: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
        }>>;
        speed: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
        sightRange: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
        outlook: import("yup/lib/object").OptionalObjectSchema<{
            0: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
            1: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
            2: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
        }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
            0: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
            1: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
            2: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
        }>>;
        speed: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
        sightRange: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    }>>;
    coordinates: import("yup/lib/object").OptionalObjectSchema<{
        lat: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
        lng: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
        lat: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
        lng: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    }>>;
    movesTo: import("yup/lib/object").OptionalObjectSchema<{
        lat: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
        lng: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
        lat: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
        lng: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    }>>;
    charactersInSight: import("yup/lib/object").OptionalObjectSchema<{
        characterId: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
        coordinates: import("yup/lib/object").OptionalObjectSchema<{
            lat: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
            lng: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
        }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
            lat: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
            lng: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
        }>>;
        nickname: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
        distance: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
        isEnemy: import("yup").BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
        characterId: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
        coordinates: import("yup/lib/object").OptionalObjectSchema<{
            lat: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
            lng: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
        }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
            lat: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
            lng: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
        }>>;
        nickname: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
        distance: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
        isEnemy: import("yup").BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    }>>;
    characterSightFlag: import("yup").BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    encountersInSight: import("yup/lib/array").OptionalArraySchema<import("yup/lib/object").OptionalObjectSchema<{
        coordinates: import("yup/lib/object").OptionalObjectSchema<{
            lat: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
            lng: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
        }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
            lat: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
            lng: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
        }>>;
        encounterId: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
        participants: import("yup/lib/array").OptionalArraySchema<import("yup/lib/object").OptionalObjectSchema<{
            characterId: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
            nickname: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
        }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
            characterId: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
            nickname: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
        }>>, any, import("yup/lib/object").TypeOfShape<{
            characterId: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
            nickname: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
        }>[]>;
        distance: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
        coordinates: import("yup/lib/object").OptionalObjectSchema<{
            lat: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
            lng: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
        }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
            lat: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
            lng: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
        }>>;
        encounterId: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
        participants: import("yup/lib/array").OptionalArraySchema<import("yup/lib/object").OptionalObjectSchema<{
            characterId: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
            nickname: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
        }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
            characterId: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
            nickname: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
        }>>, any, import("yup/lib/object").TypeOfShape<{
            characterId: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
            nickname: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
        }>[]>;
        distance: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    }>>, import("yup/lib/types").AnyObject, import("yup/lib/object").TypeOfShape<{
        coordinates: import("yup/lib/object").OptionalObjectSchema<{
            lat: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
            lng: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
        }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
            lat: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
            lng: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
        }>>;
        encounterId: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
        participants: import("yup/lib/array").OptionalArraySchema<import("yup/lib/object").OptionalObjectSchema<{
            characterId: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
            nickname: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
        }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
            characterId: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
            nickname: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
        }>>, any, import("yup/lib/object").TypeOfShape<{
            characterId: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
            nickname: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
        }>[]>;
        distance: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    }>[]>;
    encounterSightFlag: import("yup").BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    isNpc: import("yup").BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
}, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
    characterId: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
    nickname: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
    stats: import("yup/lib/object").OptionalObjectSchema<{
        outlook: import("yup/lib/object").OptionalObjectSchema<{
            0: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
            1: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
            2: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
        }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
            0: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
            1: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
            2: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
        }>>;
        speed: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
        sightRange: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
        outlook: import("yup/lib/object").OptionalObjectSchema<{
            0: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
            1: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
            2: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
        }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
            0: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
            1: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
            2: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
        }>>;
        speed: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
        sightRange: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    }>>;
    coordinates: import("yup/lib/object").OptionalObjectSchema<{
        lat: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
        lng: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
        lat: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
        lng: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    }>>;
    movesTo: import("yup/lib/object").OptionalObjectSchema<{
        lat: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
        lng: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
        lat: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
        lng: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    }>>;
    charactersInSight: import("yup/lib/object").OptionalObjectSchema<{
        characterId: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
        coordinates: import("yup/lib/object").OptionalObjectSchema<{
            lat: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
            lng: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
        }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
            lat: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
            lng: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
        }>>;
        nickname: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
        distance: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
        isEnemy: import("yup").BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
        characterId: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
        coordinates: import("yup/lib/object").OptionalObjectSchema<{
            lat: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
            lng: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
        }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
            lat: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
            lng: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
        }>>;
        nickname: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
        distance: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
        isEnemy: import("yup").BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    }>>;
    characterSightFlag: import("yup").BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    encountersInSight: import("yup/lib/array").OptionalArraySchema<import("yup/lib/object").OptionalObjectSchema<{
        coordinates: import("yup/lib/object").OptionalObjectSchema<{
            lat: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
            lng: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
        }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
            lat: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
            lng: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
        }>>;
        encounterId: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
        participants: import("yup/lib/array").OptionalArraySchema<import("yup/lib/object").OptionalObjectSchema<{
            characterId: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
            nickname: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
        }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
            characterId: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
            nickname: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
        }>>, any, import("yup/lib/object").TypeOfShape<{
            characterId: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
            nickname: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
        }>[]>;
        distance: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
        coordinates: import("yup/lib/object").OptionalObjectSchema<{
            lat: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
            lng: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
        }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
            lat: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
            lng: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
        }>>;
        encounterId: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
        participants: import("yup/lib/array").OptionalArraySchema<import("yup/lib/object").OptionalObjectSchema<{
            characterId: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
            nickname: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
        }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
            characterId: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
            nickname: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
        }>>, any, import("yup/lib/object").TypeOfShape<{
            characterId: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
            nickname: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
        }>[]>;
        distance: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    }>>, import("yup/lib/types").AnyObject, import("yup/lib/object").TypeOfShape<{
        coordinates: import("yup/lib/object").OptionalObjectSchema<{
            lat: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
            lng: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
        }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
            lat: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
            lng: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
        }>>;
        encounterId: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
        participants: import("yup/lib/array").OptionalArraySchema<import("yup/lib/object").OptionalObjectSchema<{
            characterId: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
            nickname: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
        }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
            characterId: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
            nickname: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
        }>>, any, import("yup/lib/object").TypeOfShape<{
            characterId: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
            nickname: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
        }>[]>;
        distance: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
    }>[]>;
    encounterSightFlag: import("yup").BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    isNpc: import("yup").BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
}>>;
export declare const hexXSchema: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
export declare const hexYSchema: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
export declare const hexZSchema: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
