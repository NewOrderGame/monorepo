export declare const numberSchema: import("yup").NumberSchema<number, Record<string, any>, number>;
export declare const stringSchema: import("yup").StringSchema<string, Record<string, any>, string>;
export declare const booleanSchema: import("yup").BooleanSchema<boolean, Record<string, any>, boolean>;
export declare const characterIdSchema: import("yup").StringSchema<string, Record<string, any>, string>;
export declare const encounterIdSchema: import("yup").StringSchema<string, Record<string, any>, string>;
export declare const nicknameSchema: import("yup").StringSchema<string, Record<string, any>, string>;
export declare const coordinatesSchema: import("yup/lib/object").OptionalObjectSchema<{
    lat: import("yup").StringSchema<string, Record<string, any>, string>;
    lng: import("yup").NumberSchema<number, Record<string, any>, number>;
}, Record<string, any>, import("yup/lib/object").TypeOfShape<{
    lat: import("yup").StringSchema<string, Record<string, any>, string>;
    lng: import("yup").NumberSchema<number, Record<string, any>, number>;
}>>;
export declare const outlookSchema: import("yup/lib/object").OptionalObjectSchema<{
    0: import("yup").NumberSchema<number, Record<string, any>, number>;
    1: import("yup").NumberSchema<number, Record<string, any>, number>;
    2: import("yup").NumberSchema<number, Record<string, any>, number>;
}, Record<string, any>, import("yup/lib/object").TypeOfShape<{
    0: import("yup").NumberSchema<number, Record<string, any>, number>;
    1: import("yup").NumberSchema<number, Record<string, any>, number>;
    2: import("yup").NumberSchema<number, Record<string, any>, number>;
}>>;
export declare const characterStatsSchema: import("yup/lib/object").OptionalObjectSchema<{
    outlook: import("yup/lib/object").OptionalObjectSchema<{
        0: import("yup").NumberSchema<number, Record<string, any>, number>;
        1: import("yup").NumberSchema<number, Record<string, any>, number>;
        2: import("yup").NumberSchema<number, Record<string, any>, number>;
    }, Record<string, any>, import("yup/lib/object").TypeOfShape<{
        0: import("yup").NumberSchema<number, Record<string, any>, number>;
        1: import("yup").NumberSchema<number, Record<string, any>, number>;
        2: import("yup").NumberSchema<number, Record<string, any>, number>;
    }>>;
    speed: import("yup").NumberSchema<number, Record<string, any>, number>;
    sightRange: import("yup").NumberSchema<number, Record<string, any>, number>;
}, Record<string, any>, import("yup/lib/object").TypeOfShape<{
    outlook: import("yup/lib/object").OptionalObjectSchema<{
        0: import("yup").NumberSchema<number, Record<string, any>, number>;
        1: import("yup").NumberSchema<number, Record<string, any>, number>;
        2: import("yup").NumberSchema<number, Record<string, any>, number>;
    }, Record<string, any>, import("yup/lib/object").TypeOfShape<{
        0: import("yup").NumberSchema<number, Record<string, any>, number>;
        1: import("yup").NumberSchema<number, Record<string, any>, number>;
        2: import("yup").NumberSchema<number, Record<string, any>, number>;
    }>>;
    speed: import("yup").NumberSchema<number, Record<string, any>, number>;
    sightRange: import("yup").NumberSchema<number, Record<string, any>, number>;
}>>;
export declare const encounterParticipantSchema: import("yup/lib/object").OptionalObjectSchema<{
    characterId: import("yup").StringSchema<string, Record<string, any>, string>;
    nickname: import("yup").StringSchema<string, Record<string, any>, string>;
}, Record<string, any>, import("yup/lib/object").TypeOfShape<{
    characterId: import("yup").StringSchema<string, Record<string, any>, string>;
    nickname: import("yup").StringSchema<string, Record<string, any>, string>;
}>>;
export declare const characterInSightSchema: import("yup/lib/object").OptionalObjectSchema<{
    characterId: import("yup").StringSchema<string, Record<string, any>, string>;
    coordinates: import("yup/lib/object").OptionalObjectSchema<{
        lat: import("yup").StringSchema<string, Record<string, any>, string>;
        lng: import("yup").NumberSchema<number, Record<string, any>, number>;
    }, Record<string, any>, import("yup/lib/object").TypeOfShape<{
        lat: import("yup").StringSchema<string, Record<string, any>, string>;
        lng: import("yup").NumberSchema<number, Record<string, any>, number>;
    }>>;
    nickname: import("yup").StringSchema<string, Record<string, any>, string>;
    distance: import("yup").NumberSchema<number, Record<string, any>, number>;
    isEnemy: import("yup").BooleanSchema<boolean, Record<string, any>, boolean>;
}, Record<string, any>, import("yup/lib/object").TypeOfShape<{
    characterId: import("yup").StringSchema<string, Record<string, any>, string>;
    coordinates: import("yup/lib/object").OptionalObjectSchema<{
        lat: import("yup").StringSchema<string, Record<string, any>, string>;
        lng: import("yup").NumberSchema<number, Record<string, any>, number>;
    }, Record<string, any>, import("yup/lib/object").TypeOfShape<{
        lat: import("yup").StringSchema<string, Record<string, any>, string>;
        lng: import("yup").NumberSchema<number, Record<string, any>, number>;
    }>>;
    nickname: import("yup").StringSchema<string, Record<string, any>, string>;
    distance: import("yup").NumberSchema<number, Record<string, any>, number>;
    isEnemy: import("yup").BooleanSchema<boolean, Record<string, any>, boolean>;
}>>;
export declare const encounterInSightSchema: import("yup/lib/object").OptionalObjectSchema<{
    coordinates: import("yup/lib/object").OptionalObjectSchema<{
        lat: import("yup").StringSchema<string, Record<string, any>, string>;
        lng: import("yup").NumberSchema<number, Record<string, any>, number>;
    }, Record<string, any>, import("yup/lib/object").TypeOfShape<{
        lat: import("yup").StringSchema<string, Record<string, any>, string>;
        lng: import("yup").NumberSchema<number, Record<string, any>, number>;
    }>>;
    encounterId: import("yup").StringSchema<string, Record<string, any>, string>;
    participants: import("yup/lib/array").OptionalArraySchema<import("yup/lib/object").OptionalObjectSchema<{
        characterId: import("yup").StringSchema<string, Record<string, any>, string>;
        nickname: import("yup").StringSchema<string, Record<string, any>, string>;
    }, Record<string, any>, import("yup/lib/object").TypeOfShape<{
        characterId: import("yup").StringSchema<string, Record<string, any>, string>;
        nickname: import("yup").StringSchema<string, Record<string, any>, string>;
    }>>, any, import("yup/lib/object").TypeOfShape<{
        characterId: import("yup").StringSchema<string, Record<string, any>, string>;
        nickname: import("yup").StringSchema<string, Record<string, any>, string>;
    }>[]>;
    distance: import("yup").NumberSchema<number, Record<string, any>, number>;
}, Record<string, any>, import("yup/lib/object").TypeOfShape<{
    coordinates: import("yup/lib/object").OptionalObjectSchema<{
        lat: import("yup").StringSchema<string, Record<string, any>, string>;
        lng: import("yup").NumberSchema<number, Record<string, any>, number>;
    }, Record<string, any>, import("yup/lib/object").TypeOfShape<{
        lat: import("yup").StringSchema<string, Record<string, any>, string>;
        lng: import("yup").NumberSchema<number, Record<string, any>, number>;
    }>>;
    encounterId: import("yup").StringSchema<string, Record<string, any>, string>;
    participants: import("yup/lib/array").OptionalArraySchema<import("yup/lib/object").OptionalObjectSchema<{
        characterId: import("yup").StringSchema<string, Record<string, any>, string>;
        nickname: import("yup").StringSchema<string, Record<string, any>, string>;
    }, Record<string, any>, import("yup/lib/object").TypeOfShape<{
        characterId: import("yup").StringSchema<string, Record<string, any>, string>;
        nickname: import("yup").StringSchema<string, Record<string, any>, string>;
    }>>, any, import("yup/lib/object").TypeOfShape<{
        characterId: import("yup").StringSchema<string, Record<string, any>, string>;
        nickname: import("yup").StringSchema<string, Record<string, any>, string>;
    }>[]>;
    distance: import("yup").NumberSchema<number, Record<string, any>, number>;
}>>;
export declare const characterAtWorldSchema: import("yup/lib/object").OptionalObjectSchema<{
    characterId: import("yup").StringSchema<string, Record<string, any>, string>;
    nickname: import("yup").StringSchema<string, Record<string, any>, string>;
    stats: import("yup/lib/object").OptionalObjectSchema<{
        outlook: import("yup/lib/object").OptionalObjectSchema<{
            0: import("yup").NumberSchema<number, Record<string, any>, number>;
            1: import("yup").NumberSchema<number, Record<string, any>, number>;
            2: import("yup").NumberSchema<number, Record<string, any>, number>;
        }, Record<string, any>, import("yup/lib/object").TypeOfShape<{
            0: import("yup").NumberSchema<number, Record<string, any>, number>;
            1: import("yup").NumberSchema<number, Record<string, any>, number>;
            2: import("yup").NumberSchema<number, Record<string, any>, number>;
        }>>;
        speed: import("yup").NumberSchema<number, Record<string, any>, number>;
        sightRange: import("yup").NumberSchema<number, Record<string, any>, number>;
    }, Record<string, any>, import("yup/lib/object").TypeOfShape<{
        outlook: import("yup/lib/object").OptionalObjectSchema<{
            0: import("yup").NumberSchema<number, Record<string, any>, number>;
            1: import("yup").NumberSchema<number, Record<string, any>, number>;
            2: import("yup").NumberSchema<number, Record<string, any>, number>;
        }, Record<string, any>, import("yup/lib/object").TypeOfShape<{
            0: import("yup").NumberSchema<number, Record<string, any>, number>;
            1: import("yup").NumberSchema<number, Record<string, any>, number>;
            2: import("yup").NumberSchema<number, Record<string, any>, number>;
        }>>;
        speed: import("yup").NumberSchema<number, Record<string, any>, number>;
        sightRange: import("yup").NumberSchema<number, Record<string, any>, number>;
    }>>;
    coordinates: import("yup/lib/object").OptionalObjectSchema<{
        lat: import("yup").StringSchema<string, Record<string, any>, string>;
        lng: import("yup").NumberSchema<number, Record<string, any>, number>;
    }, Record<string, any>, import("yup/lib/object").TypeOfShape<{
        lat: import("yup").StringSchema<string, Record<string, any>, string>;
        lng: import("yup").NumberSchema<number, Record<string, any>, number>;
    }>>;
    movesTo: import("yup/lib/object").OptionalObjectSchema<{
        lat: import("yup").StringSchema<string, Record<string, any>, string>;
        lng: import("yup").NumberSchema<number, Record<string, any>, number>;
    }, Record<string, any>, import("yup/lib/object").TypeOfShape<{
        lat: import("yup").StringSchema<string, Record<string, any>, string>;
        lng: import("yup").NumberSchema<number, Record<string, any>, number>;
    }>>;
    charactersInSight: import("yup/lib/object").OptionalObjectSchema<{
        characterId: import("yup").StringSchema<string, Record<string, any>, string>;
        coordinates: import("yup/lib/object").OptionalObjectSchema<{
            lat: import("yup").StringSchema<string, Record<string, any>, string>;
            lng: import("yup").NumberSchema<number, Record<string, any>, number>;
        }, Record<string, any>, import("yup/lib/object").TypeOfShape<{
            lat: import("yup").StringSchema<string, Record<string, any>, string>;
            lng: import("yup").NumberSchema<number, Record<string, any>, number>;
        }>>;
        nickname: import("yup").StringSchema<string, Record<string, any>, string>;
        distance: import("yup").NumberSchema<number, Record<string, any>, number>;
        isEnemy: import("yup").BooleanSchema<boolean, Record<string, any>, boolean>;
    }, Record<string, any>, import("yup/lib/object").TypeOfShape<{
        characterId: import("yup").StringSchema<string, Record<string, any>, string>;
        coordinates: import("yup/lib/object").OptionalObjectSchema<{
            lat: import("yup").StringSchema<string, Record<string, any>, string>;
            lng: import("yup").NumberSchema<number, Record<string, any>, number>;
        }, Record<string, any>, import("yup/lib/object").TypeOfShape<{
            lat: import("yup").StringSchema<string, Record<string, any>, string>;
            lng: import("yup").NumberSchema<number, Record<string, any>, number>;
        }>>;
        nickname: import("yup").StringSchema<string, Record<string, any>, string>;
        distance: import("yup").NumberSchema<number, Record<string, any>, number>;
        isEnemy: import("yup").BooleanSchema<boolean, Record<string, any>, boolean>;
    }>>;
    characterSightFlag: import("yup").BooleanSchema<boolean, Record<string, any>, boolean>;
    encountersInSight: import("yup/lib/array").OptionalArraySchema<import("yup/lib/object").OptionalObjectSchema<{
        coordinates: import("yup/lib/object").OptionalObjectSchema<{
            lat: import("yup").StringSchema<string, Record<string, any>, string>;
            lng: import("yup").NumberSchema<number, Record<string, any>, number>;
        }, Record<string, any>, import("yup/lib/object").TypeOfShape<{
            lat: import("yup").StringSchema<string, Record<string, any>, string>;
            lng: import("yup").NumberSchema<number, Record<string, any>, number>;
        }>>;
        encounterId: import("yup").StringSchema<string, Record<string, any>, string>;
        participants: import("yup/lib/array").OptionalArraySchema<import("yup/lib/object").OptionalObjectSchema<{
            characterId: import("yup").StringSchema<string, Record<string, any>, string>;
            nickname: import("yup").StringSchema<string, Record<string, any>, string>;
        }, Record<string, any>, import("yup/lib/object").TypeOfShape<{
            characterId: import("yup").StringSchema<string, Record<string, any>, string>;
            nickname: import("yup").StringSchema<string, Record<string, any>, string>;
        }>>, any, import("yup/lib/object").TypeOfShape<{
            characterId: import("yup").StringSchema<string, Record<string, any>, string>;
            nickname: import("yup").StringSchema<string, Record<string, any>, string>;
        }>[]>;
        distance: import("yup").NumberSchema<number, Record<string, any>, number>;
    }, Record<string, any>, import("yup/lib/object").TypeOfShape<{
        coordinates: import("yup/lib/object").OptionalObjectSchema<{
            lat: import("yup").StringSchema<string, Record<string, any>, string>;
            lng: import("yup").NumberSchema<number, Record<string, any>, number>;
        }, Record<string, any>, import("yup/lib/object").TypeOfShape<{
            lat: import("yup").StringSchema<string, Record<string, any>, string>;
            lng: import("yup").NumberSchema<number, Record<string, any>, number>;
        }>>;
        encounterId: import("yup").StringSchema<string, Record<string, any>, string>;
        participants: import("yup/lib/array").OptionalArraySchema<import("yup/lib/object").OptionalObjectSchema<{
            characterId: import("yup").StringSchema<string, Record<string, any>, string>;
            nickname: import("yup").StringSchema<string, Record<string, any>, string>;
        }, Record<string, any>, import("yup/lib/object").TypeOfShape<{
            characterId: import("yup").StringSchema<string, Record<string, any>, string>;
            nickname: import("yup").StringSchema<string, Record<string, any>, string>;
        }>>, any, import("yup/lib/object").TypeOfShape<{
            characterId: import("yup").StringSchema<string, Record<string, any>, string>;
            nickname: import("yup").StringSchema<string, Record<string, any>, string>;
        }>[]>;
        distance: import("yup").NumberSchema<number, Record<string, any>, number>;
    }>>, Record<string, any>, import("yup/lib/object").TypeOfShape<{
        coordinates: import("yup/lib/object").OptionalObjectSchema<{
            lat: import("yup").StringSchema<string, Record<string, any>, string>;
            lng: import("yup").NumberSchema<number, Record<string, any>, number>;
        }, Record<string, any>, import("yup/lib/object").TypeOfShape<{
            lat: import("yup").StringSchema<string, Record<string, any>, string>;
            lng: import("yup").NumberSchema<number, Record<string, any>, number>;
        }>>;
        encounterId: import("yup").StringSchema<string, Record<string, any>, string>;
        participants: import("yup/lib/array").OptionalArraySchema<import("yup/lib/object").OptionalObjectSchema<{
            characterId: import("yup").StringSchema<string, Record<string, any>, string>;
            nickname: import("yup").StringSchema<string, Record<string, any>, string>;
        }, Record<string, any>, import("yup/lib/object").TypeOfShape<{
            characterId: import("yup").StringSchema<string, Record<string, any>, string>;
            nickname: import("yup").StringSchema<string, Record<string, any>, string>;
        }>>, any, import("yup/lib/object").TypeOfShape<{
            characterId: import("yup").StringSchema<string, Record<string, any>, string>;
            nickname: import("yup").StringSchema<string, Record<string, any>, string>;
        }>[]>;
        distance: import("yup").NumberSchema<number, Record<string, any>, number>;
    }>[]>;
    encounterSightFlag: import("yup").BooleanSchema<boolean, Record<string, any>, boolean>;
    isNpc: import("yup").BooleanSchema<boolean, Record<string, any>, boolean>;
}, Record<string, any>, import("yup/lib/object").TypeOfShape<{
    characterId: import("yup").StringSchema<string, Record<string, any>, string>;
    nickname: import("yup").StringSchema<string, Record<string, any>, string>;
    stats: import("yup/lib/object").OptionalObjectSchema<{
        outlook: import("yup/lib/object").OptionalObjectSchema<{
            0: import("yup").NumberSchema<number, Record<string, any>, number>;
            1: import("yup").NumberSchema<number, Record<string, any>, number>;
            2: import("yup").NumberSchema<number, Record<string, any>, number>;
        }, Record<string, any>, import("yup/lib/object").TypeOfShape<{
            0: import("yup").NumberSchema<number, Record<string, any>, number>;
            1: import("yup").NumberSchema<number, Record<string, any>, number>;
            2: import("yup").NumberSchema<number, Record<string, any>, number>;
        }>>;
        speed: import("yup").NumberSchema<number, Record<string, any>, number>;
        sightRange: import("yup").NumberSchema<number, Record<string, any>, number>;
    }, Record<string, any>, import("yup/lib/object").TypeOfShape<{
        outlook: import("yup/lib/object").OptionalObjectSchema<{
            0: import("yup").NumberSchema<number, Record<string, any>, number>;
            1: import("yup").NumberSchema<number, Record<string, any>, number>;
            2: import("yup").NumberSchema<number, Record<string, any>, number>;
        }, Record<string, any>, import("yup/lib/object").TypeOfShape<{
            0: import("yup").NumberSchema<number, Record<string, any>, number>;
            1: import("yup").NumberSchema<number, Record<string, any>, number>;
            2: import("yup").NumberSchema<number, Record<string, any>, number>;
        }>>;
        speed: import("yup").NumberSchema<number, Record<string, any>, number>;
        sightRange: import("yup").NumberSchema<number, Record<string, any>, number>;
    }>>;
    coordinates: import("yup/lib/object").OptionalObjectSchema<{
        lat: import("yup").StringSchema<string, Record<string, any>, string>;
        lng: import("yup").NumberSchema<number, Record<string, any>, number>;
    }, Record<string, any>, import("yup/lib/object").TypeOfShape<{
        lat: import("yup").StringSchema<string, Record<string, any>, string>;
        lng: import("yup").NumberSchema<number, Record<string, any>, number>;
    }>>;
    movesTo: import("yup/lib/object").OptionalObjectSchema<{
        lat: import("yup").StringSchema<string, Record<string, any>, string>;
        lng: import("yup").NumberSchema<number, Record<string, any>, number>;
    }, Record<string, any>, import("yup/lib/object").TypeOfShape<{
        lat: import("yup").StringSchema<string, Record<string, any>, string>;
        lng: import("yup").NumberSchema<number, Record<string, any>, number>;
    }>>;
    charactersInSight: import("yup/lib/object").OptionalObjectSchema<{
        characterId: import("yup").StringSchema<string, Record<string, any>, string>;
        coordinates: import("yup/lib/object").OptionalObjectSchema<{
            lat: import("yup").StringSchema<string, Record<string, any>, string>;
            lng: import("yup").NumberSchema<number, Record<string, any>, number>;
        }, Record<string, any>, import("yup/lib/object").TypeOfShape<{
            lat: import("yup").StringSchema<string, Record<string, any>, string>;
            lng: import("yup").NumberSchema<number, Record<string, any>, number>;
        }>>;
        nickname: import("yup").StringSchema<string, Record<string, any>, string>;
        distance: import("yup").NumberSchema<number, Record<string, any>, number>;
        isEnemy: import("yup").BooleanSchema<boolean, Record<string, any>, boolean>;
    }, Record<string, any>, import("yup/lib/object").TypeOfShape<{
        characterId: import("yup").StringSchema<string, Record<string, any>, string>;
        coordinates: import("yup/lib/object").OptionalObjectSchema<{
            lat: import("yup").StringSchema<string, Record<string, any>, string>;
            lng: import("yup").NumberSchema<number, Record<string, any>, number>;
        }, Record<string, any>, import("yup/lib/object").TypeOfShape<{
            lat: import("yup").StringSchema<string, Record<string, any>, string>;
            lng: import("yup").NumberSchema<number, Record<string, any>, number>;
        }>>;
        nickname: import("yup").StringSchema<string, Record<string, any>, string>;
        distance: import("yup").NumberSchema<number, Record<string, any>, number>;
        isEnemy: import("yup").BooleanSchema<boolean, Record<string, any>, boolean>;
    }>>;
    characterSightFlag: import("yup").BooleanSchema<boolean, Record<string, any>, boolean>;
    encountersInSight: import("yup/lib/array").OptionalArraySchema<import("yup/lib/object").OptionalObjectSchema<{
        coordinates: import("yup/lib/object").OptionalObjectSchema<{
            lat: import("yup").StringSchema<string, Record<string, any>, string>;
            lng: import("yup").NumberSchema<number, Record<string, any>, number>;
        }, Record<string, any>, import("yup/lib/object").TypeOfShape<{
            lat: import("yup").StringSchema<string, Record<string, any>, string>;
            lng: import("yup").NumberSchema<number, Record<string, any>, number>;
        }>>;
        encounterId: import("yup").StringSchema<string, Record<string, any>, string>;
        participants: import("yup/lib/array").OptionalArraySchema<import("yup/lib/object").OptionalObjectSchema<{
            characterId: import("yup").StringSchema<string, Record<string, any>, string>;
            nickname: import("yup").StringSchema<string, Record<string, any>, string>;
        }, Record<string, any>, import("yup/lib/object").TypeOfShape<{
            characterId: import("yup").StringSchema<string, Record<string, any>, string>;
            nickname: import("yup").StringSchema<string, Record<string, any>, string>;
        }>>, any, import("yup/lib/object").TypeOfShape<{
            characterId: import("yup").StringSchema<string, Record<string, any>, string>;
            nickname: import("yup").StringSchema<string, Record<string, any>, string>;
        }>[]>;
        distance: import("yup").NumberSchema<number, Record<string, any>, number>;
    }, Record<string, any>, import("yup/lib/object").TypeOfShape<{
        coordinates: import("yup/lib/object").OptionalObjectSchema<{
            lat: import("yup").StringSchema<string, Record<string, any>, string>;
            lng: import("yup").NumberSchema<number, Record<string, any>, number>;
        }, Record<string, any>, import("yup/lib/object").TypeOfShape<{
            lat: import("yup").StringSchema<string, Record<string, any>, string>;
            lng: import("yup").NumberSchema<number, Record<string, any>, number>;
        }>>;
        encounterId: import("yup").StringSchema<string, Record<string, any>, string>;
        participants: import("yup/lib/array").OptionalArraySchema<import("yup/lib/object").OptionalObjectSchema<{
            characterId: import("yup").StringSchema<string, Record<string, any>, string>;
            nickname: import("yup").StringSchema<string, Record<string, any>, string>;
        }, Record<string, any>, import("yup/lib/object").TypeOfShape<{
            characterId: import("yup").StringSchema<string, Record<string, any>, string>;
            nickname: import("yup").StringSchema<string, Record<string, any>, string>;
        }>>, any, import("yup/lib/object").TypeOfShape<{
            characterId: import("yup").StringSchema<string, Record<string, any>, string>;
            nickname: import("yup").StringSchema<string, Record<string, any>, string>;
        }>[]>;
        distance: import("yup").NumberSchema<number, Record<string, any>, number>;
    }>>, Record<string, any>, import("yup/lib/object").TypeOfShape<{
        coordinates: import("yup/lib/object").OptionalObjectSchema<{
            lat: import("yup").StringSchema<string, Record<string, any>, string>;
            lng: import("yup").NumberSchema<number, Record<string, any>, number>;
        }, Record<string, any>, import("yup/lib/object").TypeOfShape<{
            lat: import("yup").StringSchema<string, Record<string, any>, string>;
            lng: import("yup").NumberSchema<number, Record<string, any>, number>;
        }>>;
        encounterId: import("yup").StringSchema<string, Record<string, any>, string>;
        participants: import("yup/lib/array").OptionalArraySchema<import("yup/lib/object").OptionalObjectSchema<{
            characterId: import("yup").StringSchema<string, Record<string, any>, string>;
            nickname: import("yup").StringSchema<string, Record<string, any>, string>;
        }, Record<string, any>, import("yup/lib/object").TypeOfShape<{
            characterId: import("yup").StringSchema<string, Record<string, any>, string>;
            nickname: import("yup").StringSchema<string, Record<string, any>, string>;
        }>>, any, import("yup/lib/object").TypeOfShape<{
            characterId: import("yup").StringSchema<string, Record<string, any>, string>;
            nickname: import("yup").StringSchema<string, Record<string, any>, string>;
        }>[]>;
        distance: import("yup").NumberSchema<number, Record<string, any>, number>;
    }>[]>;
    encounterSightFlag: import("yup").BooleanSchema<boolean, Record<string, any>, boolean>;
    isNpc: import("yup").BooleanSchema<boolean, Record<string, any>, boolean>;
}>>;
export declare const hexXSchema: import("yup").NumberSchema<number, Record<string, any>, number>;
export declare const hexYSchema: import("yup").NumberSchema<number, Record<string, any>, number>;
export declare const hexZSchema: import("yup").NumberSchema<number, Record<string, any>, number>;
