import characterAtWorldStore from '../store/character-at-world-store';
import encounterStore from '../store/encounter-store';
import characterStore from '../store/character-store';
import { createCharacter } from './character';
import { nanoid } from 'nanoid';
import { createCharacterAtWorld } from './character-at-world';
import {
  Character,
  CharacterAtWorld,
  CharacterInSight,
  CharacterStats,
  Encounter,
  EncounterInSight,
  NogEvent
} from '@newordergame/common';
import {
  checkCharacterVisibility,
  checkEncounterVisibility,
  handleMoveEvent,
  moveCharacter,
  sendCharactersInSight,
  sendEncountersInSight
} from './world';
import {
  computeDestinationPoint as computeDestination,
  computeDestinationPoint,
  getDistance as computeDistance,
  getGreatCircleBearing as computeBearing
} from 'geolib';
import { DISTANCE_ACCURACY, TICK_PER_SECOND } from './utils/constants';
import { getFakeNamespace, getFakeSocket } from '../test/utils';

const DEFAULT_CHARACTER_STATS: CharacterStats = {
  outlook: [0, 0, 0],
  speed: 30,
  sightRange: 100
};

const DEFAULT_ENCOUNTER = {
  encounterId: nanoid(),
  coordinates: { lat: 0, lng: 0 },
  encounterStartTime: null,
  participants: [
    {
      ...createCharacterAtWorld({
        character: {
          characterId: nanoid(),
          nickname: 'A',
          coordinates: { lat: 0, lng: 0 },
          stats: {
            outlook: [0, 0, 0],
            sightRange: 100,
            speed: 30
          }
        } as Character,
        isNpc: false
      }),
      charactersInSight: [],
      encountersInSight: []
    } as CharacterAtWorld,
    {
      ...createCharacterAtWorld({
        character: {
          characterId: nanoid(),
          nickname: 'B',
          coordinates: { lat: 0, lng: 0 },
          stats: {
            outlook: [0, 0, 0],
            sightRange: 100,
            speed: 30
          }
        } as Character,
        isNpc: false
      }),
      charactersInSight: [],
      encountersInSight: []
    } as CharacterAtWorld
  ]
} as Encounter;

describe('World', () => {
  beforeEach(() => {
    characterAtWorldStore.clear();
    encounterStore.clear();
    characterStore.clear();
  });

  describe('Movement', () => {
    describe('moveCharacter. Move character along with the tick', () => {
      test('Does nothing if "movesTo" is falsy', () => {
        const character = {
          ...createCharacter({
            characterId: nanoid(),
            nickname: 'TestUser',
            stats: DEFAULT_CHARACTER_STATS
          })
        };

        characterStore.set(character.characterId, character);

        const characterAtWorld = {
          ...createCharacterAtWorld({
            character: character,
            isNpc: false
          }),
          charactersInSight: [],
          encountersInSight: []
        } as CharacterAtWorld;

        characterAtWorldStore.set(
          characterAtWorld.characterId,
          characterAtWorld
        );

        const characterBefore = { ...character };
        const characterAtWorldBefore = { ...characterAtWorld };

        moveCharacter(characterAtWorld.characterId);

        expect(character).toEqual(characterBefore);
        expect(characterAtWorld).toEqual(characterAtWorldBefore);
      });

      test('Does something if "movesTo" is defined', () => {
        const character = {
          ...createCharacter({
            characterId: nanoid(),
            nickname: 'TestUser',
            stats: DEFAULT_CHARACTER_STATS
          })
        };

        characterStore.set(character.characterId, character);

        const characterAtWorld = {
          ...createCharacterAtWorld({
            character: character,
            isNpc: false
          }),
          movesTo: { lat: 46.47684829298625, lng: 30.730953812599186 }
        } as CharacterAtWorld;

        characterAtWorldStore.set(
          characterAtWorld.characterId,
          characterAtWorld
        );

        const characterBefore = { ...character };
        const characterAtWorldBefore = { ...characterAtWorld };

        moveCharacter(characterAtWorld.characterId);

        expect(character).not.toEqual(characterBefore);
        expect(characterAtWorld).not.toEqual(characterAtWorldBefore);
      });

      test('Assign final destination point to coordinates if distance is less than speed with multiplier', () => {
        const coordinates = { lat: 46.47684829298625, lng: 30.730953812599186 };

        const character = {
          ...createCharacter({
            characterId: nanoid(),
            nickname: 'TestUser',
            stats: DEFAULT_CHARACTER_STATS
          }),
          coordinates
        } as Character;

        characterStore.set(character.characterId, { ...character });

        const characterAtWorld = {
          ...createCharacterAtWorld({
            character: character,
            isNpc: false
          }),
          coordinates
        } as CharacterAtWorld;

        const movesTo = computeDestinationPoint(
          coordinates,
          characterAtWorld.stats.speed / TICK_PER_SECOND - 1,
          0
        );

        characterAtWorldStore.set(characterAtWorld.characterId, {
          ...characterAtWorld,
          movesTo: {
            lat: movesTo.latitude,
            lng: movesTo.longitude
          }
        });

        moveCharacter(characterAtWorld.characterId);

        expect(character.coordinates).not.toEqual(movesTo);
        expect(characterAtWorld.coordinates).not.toEqual(movesTo);
      });

      test('Assigns next destination point to coordinates if distance is greater than speed with multiplier', () => {
        const startCoordinates = {
          lat: 46.47684829298625,
          lng: 30.730953812599186
        };

        const character = {
          ...createCharacter({
            characterId: nanoid(),
            nickname: 'TestUser',
            stats: DEFAULT_CHARACTER_STATS
          }),
          coordinates: startCoordinates
        } as Character;
        characterStore.set(character.characterId, { ...character });

        const characterBefore = {
          ...createCharacterAtWorld({
            character: character,
            isNpc: false
          }),
          coordinates: startCoordinates
        } as CharacterAtWorld;

        const destination = computeDestinationPoint(
          startCoordinates,
          characterBefore.stats.speed / TICK_PER_SECOND + 100,
          0
        );
        const movesTo = {
          lat: destination.latitude,
          lng: destination.longitude
        };

        characterBefore.movesTo = movesTo;
        characterAtWorldStore.set(characterBefore.characterId, {
          ...characterBefore,
          movesTo
        });

        const bearing = computeBearing(
          characterBefore.coordinates,
          characterBefore.movesTo
        );

        const intermediateDestination = computeDestination(
          characterBefore.coordinates,
          characterBefore.stats.speed / TICK_PER_SECOND,
          bearing
        );

        const intermediateCoordinates = {
          lat: intermediateDestination.latitude,
          lng: intermediateDestination.longitude
        };

        moveCharacter(characterBefore.characterId);

        const characterAfter = characterAtWorldStore.get(
          characterBefore.characterId
        );

        expect(characterAfter.coordinates).toEqual(intermediateCoordinates);
        expect(characterStore.get(character.characterId).coordinates).toEqual(
          intermediateCoordinates
        );
        expect(
          characterAtWorldStore.get(characterAfter.characterId).coordinates
        ).toEqual(intermediateCoordinates);
      });
    });

    describe('handleMoveEvent. Handles the movement request', () => {
      test(`Handles character's movement`, () => {
        const socket = getFakeSocket();
        const startCoordinates = {
          lat: 46.47684829298625,
          lng: 30.730953812599186
        };
        const movesTo = { lat: 46.47736917180925, lng: 30.7302188873291 };

        const character = {
          ...createCharacter({
            characterId: nanoid(),
            nickname: 'TestUser',
            stats: DEFAULT_CHARACTER_STATS
          }),
          coordinates: startCoordinates
        } as Character;
        characterStore.set(character.characterId, { ...character });

        const characterAtWorld = {
          ...createCharacterAtWorld({
            character: character,
            isNpc: false
          }),
          coordinates: startCoordinates
        } as CharacterAtWorld;
        characterAtWorldStore.set(characterAtWorld.characterId, {
          ...characterAtWorld
        });

        const distance = computeDistance(
          {
            latitude: characterAtWorld.coordinates.lat,
            longitude: characterAtWorld.coordinates.lng
          },
          {
            latitude: movesTo.lat,
            longitude: movesTo.lng
          },
          DISTANCE_ACCURACY
        );

        const duration = distance / characterAtWorld.stats.speed;

        socket.data.characterId = character.characterId;

        handleMoveEvent(socket, movesTo);

        expect(
          characterAtWorldStore.get(characterAtWorld.characterId).movesTo
        ).toEqual(movesTo);
        expect(socket.emit).toHaveBeenCalledWith(NogEvent.MOVE, {
          coordinates: movesTo,
          duration,
          distance
        });
      });
    });
  });

  describe('Visibility', () => {
    beforeEach(() => {
      characterAtWorldStore.clear();
      encounterStore.clear();
    });

    describe('checkCharacterVisibility. Determines whether characterB is visible for characterA and changes characterSightFlag', () => {
      test('Character A should see Character B', () => {
        const charactersInSightA: CharacterInSight[] = [];
        const charactersInSightB: CharacterInSight[] = [];

        const characterAtWorldA = {
          ...createCharacterAtWorld({
            character: {
              characterId: nanoid(),
              nickname: 'A',
              coordinates: { lat: 46.47684829298625, lng: 30.730953812599186 },
              stats: {
                outlook: [0, 0, 0],
                sightRange: 100,
                speed: 30
              }
            } as Character,
            isNpc: false
          }),
          charactersInSight: charactersInSightA,
          encountersInSight: []
        } as CharacterAtWorld;

        const characterAtWorldB = {
          ...createCharacterAtWorld({
            character: {
              characterId: nanoid(),
              nickname: 'B',
              coordinates: { lat: 46.47684829298625, lng: 30.730953812599186 },
              stats: {
                outlook: [0, 0, 0],
                sightRange: 100,
                speed: 30
              }
            } as Character,
            isNpc: false
          })
        } as CharacterAtWorld;

        characterAtWorldStore.set(
          characterAtWorldA.characterId,
          characterAtWorldA
        );
        characterAtWorldStore.set(
          characterAtWorldB.characterId,
          characterAtWorldB
        );

        checkCharacterVisibility(
          characterAtWorldA.characterId,
          characterAtWorldB.characterId,
          charactersInSightA,
          charactersInSightB
        );

        expect(charactersInSightA.length).toBe(1);
        expect(characterAtWorldA.characterSightFlag).toBe(true);
        expect(
          characterAtWorldStore.get(characterAtWorldA.characterId)
            .characterSightFlag
        ).toBe(true);
      });

      test('Character A should not see Character B', () => {
        const charactersInSightA: CharacterInSight[] = [];
        const charactersInSightB: CharacterInSight[] = [];

        const characterAtWorldA = {
          ...createCharacterAtWorld({
            character: {
              characterId: nanoid(),
              nickname: 'A',
              coordinates: { lat: 46.47684829298625, lng: 30.730953812599186 },
              stats: {
                outlook: [0, 0, 0],
                sightRange: 100,
                speed: 30
              }
            } as Character,
            isNpc: false
          }),
          charactersInSight: charactersInSightA
        };

        const characterAtWorldB = {
          ...createCharacterAtWorld({
            character: {
              characterId: nanoid(),
              nickname: 'B',
              coordinates: { lat: 46.47651581453476, lng: 30.73301374912262 },
              stats: {
                outlook: [0, 0, 0],
                sightRange: 100,
                speed: 30
              }
            } as Character,
            isNpc: false
          })
        } as CharacterAtWorld;

        characterAtWorldStore.set(
          characterAtWorldA.characterId,
          characterAtWorldA
        );
        characterAtWorldStore.set(
          characterAtWorldB.characterId,
          characterAtWorldB
        );

        checkCharacterVisibility(
          characterAtWorldA.characterId,
          characterAtWorldB.characterId,
          charactersInSightA,
          charactersInSightB
        );

        expect(charactersInSightA.length).toBe(0);
        expect(characterAtWorldA.characterSightFlag).toBe(false);
        expect(
          characterAtWorldStore.get(characterAtWorldA.characterId)
            .characterSightFlag
        ).toBe(false);
      });
    });

    describe('sendCharactersInSight. Sends message and changes characterSightFlag', () => {
      test(`Should send charactersInSight and set Character A's characterSightFlag to "false"`, () => {
        const charactersInSight: CharacterInSight[] = [];
        const world = getFakeNamespace();

        const characterAtWorld = {
          ...createCharacterAtWorld({
            character: {
              characterId: nanoid(),
              nickname: 'A',
              coordinates: { lat: 46.47684829298625, lng: 30.730953812599186 },
              stats: {
                outlook: [0, 0, 0],
                sightRange: 100,
                speed: 30
              }
            } as Character,
            isNpc: false
          }),
          charactersInSight
        };

        characterAtWorld.characterSightFlag = true;

        characterAtWorldStore.set(
          characterAtWorld.characterId,
          characterAtWorld
        );

        sendCharactersInSight(
          characterAtWorld.characterId,
          charactersInSight,
          world
        );

        expect(characterAtWorld.characterSightFlag).toBe(false);
        expect(
          characterAtWorldStore.get(characterAtWorld.characterId)
            .characterSightFlag
        ).toBe(false);
        expect(world.to).toBeCalled();
        expect(world.to).toBeCalledWith(characterAtWorld.characterId);
        expect(world.to(characterAtWorld.characterId).emit).toBeCalled();
        expect(world.to(characterAtWorld.characterId).emit).toBeCalledWith(
          NogEvent.CHARACTERS_IN_SIGHT,
          charactersInSight
        );
      });

      test('Should not send charactersInSight', () => {
        const charactersInSight: CharacterInSight[] = [];
        const world = getFakeNamespace();

        const characterAtWorld = {
          ...createCharacterAtWorld({
            character: {
              characterId: nanoid(),
              nickname: 'A',
              coordinates: { lat: 46.47684829298625, lng: 30.730953812599186 },
              stats: {
                outlook: [0, 0, 0],
                sightRange: 100,
                speed: 30
              }
            } as Character,
            isNpc: false
          }),
          charactersInSight
        };

        characterAtWorld.characterSightFlag = false;

        characterAtWorldStore.set(
          characterAtWorld.characterId,
          characterAtWorld
        );

        sendCharactersInSight(
          characterAtWorld.characterId,
          charactersInSight,
          world
        );

        expect(characterAtWorld.characterSightFlag).toBe(false);
        expect(charactersInSight.length).toBe(0);
        expect(
          characterAtWorldStore.get(characterAtWorld.characterId)
            .characterSightFlag
        ).toBe(false);
        expect(world.to(characterAtWorld.characterId).emit).not.toBeCalled();
      });
    });

    describe('checkEncounterVisibility. Determines whether character sees encounter', () => {
      test('Character should see Encounter', () => {
        const encountersInSight: EncounterInSight[] = [];

        const characterAtWorld = {
          ...createCharacterAtWorld({
            character: {
              characterId: nanoid(),
              nickname: 'A',
              coordinates: { lat: 46.47684829298625, lng: 30.730953812599186 },
              stats: {
                outlook: [0, 0, 0],
                sightRange: 100,
                speed: 30
              }
            } as Character,
            isNpc: false
          }),
          charactersInSight: [],
          encountersInSight
        } as CharacterAtWorld;

        const encounter = {
          ...DEFAULT_ENCOUNTER,
          encounterId: nanoid(),
          coordinates: { lat: 46.47684829298625, lng: 30.730953812599186 },
          stats: {
            outlook: [0, 0, 0],
            sightRange: 100,
            speed: 30
          }
        } as Encounter;

        characterAtWorldStore.set(
          characterAtWorld.characterId,
          characterAtWorld
        );
        encounterStore.set(encounter.encounterId, encounter);

        checkEncounterVisibility(
          characterAtWorld.characterId,
          encounter.encounterId,
          encountersInSight
        );

        expect(encountersInSight.length).toBe(1);
        expect(characterAtWorld.encounterSightFlag).toBe(true);
        expect(
          characterAtWorldStore.get(characterAtWorld.characterId)
            .encounterSightFlag
        ).toBe(true);
      });

      test('Character should not see Encounter', () => {
        const encountersInSight: EncounterInSight[] = [];

        const characterAtWorld = {
          ...createCharacterAtWorld({
            character: {
              characterId: nanoid(),
              nickname: 'A',
              coordinates: { lat: 46.47684829298625, lng: 30.730953812599186 },
              stats: {
                outlook: [0, 0, 0],
                sightRange: 100,
                speed: 30
              }
            } as Character,
            isNpc: false
          }),
          charactersInSight: [],
          encountersInSight
        } as CharacterAtWorld;

        const encounter = {
          ...DEFAULT_ENCOUNTER,
          encounterId: nanoid(),
          coordinates: { lat: 46.47651581453476, lng: 30.73301374912262 },
          stats: {
            outlook: [0, 0, 0],
            sightRange: 100,
            speed: 30
          }
        } as Encounter;

        characterAtWorldStore.set(
          characterAtWorld.characterId,
          characterAtWorld
        );
        encounterStore.set(encounter.encounterId, encounter);

        checkEncounterVisibility(
          characterAtWorld.characterId,
          encounter.encounterId,
          encountersInSight
        );

        expect(encountersInSight.length).toBe(0);
        expect(characterAtWorld.encounterSightFlag).toBe(false);
        expect(
          characterAtWorldStore.get(characterAtWorld.characterId)
            .encounterSightFlag
        ).toBe(false);
      });
    });

    describe('sendEncountersInSight. Sends message and changes encountersSightFlag', () => {
      test(`Should send encountersInSight and set Character A's encounterSightFlag to "false"`, () => {
        const encountersInSight: EncounterInSight[] = [];
        const world = getFakeNamespace();

        const characterAtWorld = {
          ...createCharacterAtWorld({
            character: {
              characterId: nanoid(),
              nickname: 'A',
              coordinates: { lat: 46.47684829298625, lng: 30.730953812599186 },
              stats: {
                outlook: [0, 0, 0],
                sightRange: 100,
                speed: 30
              }
            } as Character,
            isNpc: false
          }),
          charactersInSight: [],
          encountersInSight
        } as CharacterAtWorld;

        characterAtWorld.encounterSightFlag = true;

        characterAtWorldStore.set(
          characterAtWorld.characterId,
          characterAtWorld
        );

        sendEncountersInSight(
          characterAtWorld.characterId,
          encountersInSight,
          world
        );

        expect(encountersInSight.length).toBe(0);
        expect(characterAtWorld.encounterSightFlag).toBe(false);
        expect(
          characterAtWorldStore.get(characterAtWorld.characterId)
            .encounterSightFlag
        ).toBe(false);
        expect(world.to(characterAtWorld.characterId).emit).toBeCalledWith(
          NogEvent.ENCOUNTERS_IN_SIGHT,
          encountersInSight
        );
      });

      test(`Should not send encountersInSight`, () => {
        const encountersInSight: EncounterInSight[] = [];
        const world = getFakeNamespace();

        const characterAtWorld = {
          ...createCharacterAtWorld({
            character: {
              characterId: nanoid(),
              nickname: 'A',
              coordinates: { lat: 46.47684829298625, lng: 30.730953812599186 },
              stats: {
                outlook: [0, 0, 0],
                sightRange: 100,
                speed: 30
              }
            } as Character,
            isNpc: false
          }),
          charactersInSight: [],
          encountersInSight
        } as CharacterAtWorld;

        characterAtWorld.encounterSightFlag = false;

        characterAtWorldStore.set(
          characterAtWorld.characterId,
          characterAtWorld
        );

        sendEncountersInSight(
          characterAtWorld.characterId,
          encountersInSight,
          world
        );

        expect(encountersInSight.length).toBe(0);
        expect(characterAtWorld.encounterSightFlag).toBe(false);
        expect(
          characterAtWorldStore.get(characterAtWorld.characterId)
            .encounterSightFlag
        ).toBe(false);
        expect(world.to(characterAtWorld.characterId).emit).not.toBeCalled();
      });
    });
  });
});
