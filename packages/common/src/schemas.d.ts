export declare const characterIdSchema: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
export declare const coordinatesSchema: import("yup/lib/object").OptionalObjectSchema<{
    lat: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
    lng: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
}, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
    lat: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
    lng: import("yup").NumberSchema<number, import("yup/lib/types").AnyObject, number>;
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
export declare const characterAtWorldSchema: import("yup/lib/object").OptionalObjectSchema<{
    characterId: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
    nickname: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
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
    encountersInSight: import("yup/lib/object").OptionalObjectSchema<import("yup/lib/object").ObjectShape, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").ObjectShape>>;
    encounterSightFlag: import("yup").BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    stats: import("yup/lib/object").OptionalObjectSchema<import("yup/lib/object").ObjectShape, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").ObjectShape>>;
    isNpc: import("yup").BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
}, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
    characterId: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
    nickname: import("yup").StringSchema<string, import("yup/lib/types").AnyObject, string>;
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
    encountersInSight: import("yup/lib/object").OptionalObjectSchema<import("yup/lib/object").ObjectShape, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").ObjectShape>>;
    encounterSightFlag: import("yup").BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
    stats: import("yup/lib/object").OptionalObjectSchema<import("yup/lib/object").ObjectShape, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<import("yup/lib/object").ObjectShape>>;
    isNpc: import("yup").BooleanSchema<boolean, import("yup/lib/types").AnyObject, boolean>;
}>>;
