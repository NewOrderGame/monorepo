import characterStore from './store/character-store';
import characterAtWorldStore from './store/character-at-world-store';
import encounterStore from './store/encounter-store';
import { createCharacterAtWorld } from './character-at-world';
import { nanoid } from 'nanoid';
import { createCharacter } from './character';
import { CharacterAtWorld, CharacterStats } from '@newordergame/common';
import { ENCOUNTER_COOL_DOWN_TIME } from './constants';
import { getFakeNamespace } from '../test/utils';
import { handleCharactersEncounter } from './encounter';
import moment = require('moment');

jest.mock('./game-namespace');

const DEFAULT_CHARACTER_STATS: CharacterStats = {
  outlook: [0, 0, 0],
  speed: 30,
  sightRange: 100
};

describe('Visibility module', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    characterAtWorldStore.clear();
    encounterStore.clear();
    characterStore.clear();
  });

  afterEach(() => {
    jest.runAllTimers();
  });

  describe('handleCharactersEncounter. Handles encounter between characters on map', () => {
    test('Creates encounter if characters are closer than ENCOUNTER_DISTANCE', () => {
      const encounterStartTime = moment().valueOf();
      const world = getFakeNamespace();

      const characterA = {
        ...createCharacter({
          characterId: nanoid(),
          nickname: 'TestUser',
          stats: DEFAULT_CHARACTER_STATS
        })
      };

      const characterB = {
        ...createCharacter({
          characterId: nanoid(),
          nickname: 'TestUser',
          stats: DEFAULT_CHARACTER_STATS
        })
      };

      characterStore.set(characterA.characterId, characterA);
      characterStore.set(characterB.characterId, characterB);

      const characterAtWorldA = createCharacterAtWorld({
        character: characterA,
        isNpc: false
      });

      const characterAtWorldB = createCharacterAtWorld({
        character: characterB,
        isNpc: false
      });

      characterAtWorldStore.set(
        characterAtWorldA.characterId,
        characterAtWorldA
      );
      characterAtWorldStore.set(
        characterAtWorldB.characterId,
        characterAtWorldB
      );

      expect(encounterStore.size()).toBe(0);

      handleCharactersEncounter(
        characterAtWorldA.characterId,
        characterAtWorldB.characterId,
        world
      );

      encounterStore.forEach((encounter) => {
        const participantA = encounter.participants.find(
          (participant) =>
            participant.characterId === characterAtWorldA.characterId
        );
        const participantB = encounter.participants.find(
          (participant) =>
            participant.characterId === characterAtWorldB.characterId
        );

        expect(characterA.encounterId).toBe(encounter.encounterId);
        expect(characterB.encounterId).toBe(encounter.encounterId);

        if (!characterA.encounterStartTime || !characterB.encounterStartTime) {
          throw new Error('Encounter start time is missing');
        }

        expect(characterA.encounterStartTime - encounterStartTime).toBeLessThan(
          10
        );
        expect(characterB.encounterStartTime - encounterStartTime).toBeLessThan(
          10
        );
        expect(characterA.encounterStartTime).toBe(
          characterB.encounterStartTime
        );

        expect(participantA).toEqual(
          expect.objectContaining({
            characterId: characterAtWorldA.characterId
          })
        );
        expect(participantB).toEqual(
          expect.objectContaining({
            characterId: characterAtWorldB.characterId
          })
        );
      });

      expect(encounterStore.size()).toBe(1);
      expect(characterAtWorldStore.size()).toBe(0);
    });

    test('Does not create encounter if characters are further than ENCOUNTER_DISTANCE', () => {
      const encounterStartTime = moment().subtract(50, 'seconds').valueOf();
      const world = getFakeNamespace();

      const characterA = {
        ...createCharacter({
          characterId: nanoid(),
          nickname: 'TestUser',
          stats: DEFAULT_CHARACTER_STATS
        }),
        encounterStartTime,
        coordinates: { lat: 50, lng: 30 }
      };

      const characterB = {
        ...createCharacter({
          characterId: nanoid(),
          nickname: 'TestUser',
          stats: DEFAULT_CHARACTER_STATS
        }),
        encounterStartTime,
        coordinates: { lat: 40, lng: 30 }
      };

      characterStore.set(characterA.characterId, characterA);
      characterStore.set(characterB.characterId, characterB);

      const characterAtWorldA = {
        ...createCharacterAtWorld({
          character: characterA,
          isNpc: false
        })
      } as CharacterAtWorld;

      const characterAtWorldB = {
        ...createCharacterAtWorld({
          character: characterB,
          isNpc: false
        }),
        charactersInSight: [],
        encountersInSight: []
      } as CharacterAtWorld;

      characterAtWorldStore.set(
        characterAtWorldA.characterId,
        characterAtWorldA
      );
      characterAtWorldStore.set(
        characterAtWorldB.characterId,
        characterAtWorldB
      );

      expect(encounterStore.size()).toBe(0);
      expect(characterAtWorldStore.size()).toBe(2);

      handleCharactersEncounter(
        characterAtWorldA.characterId,
        characterAtWorldB.characterId,
        world
      );

      expect(encounterStore.size()).toBe(0);
      expect(characterAtWorldStore.size()).toBe(2);
    });

    test(
      'Does not create encounter if both characters have' +
        ' encounterStartTime',
      () => {
        const encounterStartTime = moment().subtract(50, 'seconds').valueOf();
        const world = getFakeNamespace();

        const characterA = {
          ...createCharacter({
            characterId: nanoid(),
            nickname: 'TestUser',
            stats: DEFAULT_CHARACTER_STATS
          }),
          encounterStartTime
        };

        const characterB = {
          ...createCharacter({
            characterId: nanoid(),
            nickname: 'TestUser',
            stats: DEFAULT_CHARACTER_STATS
          }),
          encounterStartTime
        };

        characterStore.set(characterA.characterId, characterA);
        characterStore.set(characterB.characterId, characterB);

        const characterAtWorldA = {
          ...createCharacterAtWorld({
            character: characterA,
            isNpc: false
          }),
          charactersInSight: [],
          encountersInSight: []
        } as CharacterAtWorld;

        const characterAtWorldB = {
          ...createCharacterAtWorld({
            character: characterB,
            isNpc: false
          }),
          charactersInSight: [],
          encountersInSight: []
        } as CharacterAtWorld;

        characterAtWorldStore.set(
          characterAtWorldA.characterId,
          characterAtWorldA
        );
        characterAtWorldStore.set(
          characterAtWorldB.characterId,
          characterAtWorldB
        );

        expect(encounterStore.size()).toBe(0);
        expect(characterAtWorldStore.size()).toBe(2);

        handleCharactersEncounter(
          characterAtWorldA.characterId,
          characterAtWorldB.characterId,
          world
        );

        expect(encounterStore.size()).toBe(0);
        expect(characterAtWorldStore.size()).toBe(2);
      }
    );

    test(`Does not create encounter if encounterEndTime is less than ENCOUNTER_COOL_DOWN_TIME`, () => {
      const world = getFakeNamespace();
      const encounterEndTime = moment()
        .subtract(ENCOUNTER_COOL_DOWN_TIME - 1, 'seconds')
        .valueOf();

      const characterA = {
        ...createCharacter({
          characterId: nanoid(),
          nickname: 'TestUser',
          stats: DEFAULT_CHARACTER_STATS
        }),
        encounterEndTime
      };

      const characterB = {
        ...createCharacter({
          characterId: nanoid(),
          nickname: 'TestUser',
          stats: DEFAULT_CHARACTER_STATS
        })
      };

      characterStore.set(characterA.characterId, characterA);
      characterStore.set(characterB.characterId, characterB);

      const characterAtWorldA = {
        ...createCharacterAtWorld({
          character: characterA,
          isNpc: false
        }),
        charactersInSight: [],
        encountersInSight: []
      } as CharacterAtWorld;

      const characterAtWorldB = {
        ...createCharacterAtWorld({
          character: characterB,
          isNpc: false
        }),
        charactersInSight: [],
        encountersInSight: []
      } as CharacterAtWorld;

      characterAtWorldStore.set(
        characterAtWorldA.characterId,
        characterAtWorldA
      );
      characterAtWorldStore.set(
        characterAtWorldB.characterId,
        characterAtWorldB
      );

      expect(encounterStore.size()).toBe(0);
      expect(characterAtWorldStore.size()).toBe(2);

      handleCharactersEncounter(
        characterAtWorldA.characterId,
        characterAtWorldB.characterId,
        world
      );

      expect(encounterStore.size()).toBe(0);
      expect(characterAtWorldStore.size()).toBe(2);
    });
  });
});
