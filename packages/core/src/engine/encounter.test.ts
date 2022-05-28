import characterStore from '../store/character-store';
import characterAtWorldStore from '../store/character-at-world-store';
import encounterStore from '../store/encounter-store';
import { createCharacterAtWorld } from '../lib/character-at-world';
import { nanoid } from 'nanoid';
import { handleCharactersEncounter } from './encounter';
import { createCharacter } from '../lib/character';
import { CharacterAtWorld } from '@newordergame/common';
import { ENCOUNTER_COOL_DOWN_TIME } from '../lib/constants';
import moment = require('moment');
import { getFakeNamespace } from '../test/utils';

jest.mock('../namespaces/world-namespace');

describe('Visibility module', () => {
  beforeEach(() => {
    characterAtWorldStore.clear();
    encounterStore.clear();
    characterStore.clear();
  });

  describe('handleCharactersEncounter. Handles encounter between characters on map', () => {
    test('Creates encounter if characters are closer than ENCOUNTER_DISTANCE', () => {
      const encounterStartTime = moment().valueOf();
      const world = getFakeNamespace();

      const characterA = {
        ...createCharacter({ characterId: nanoid() })
      };

      const characterB = {
        ...createCharacter({ characterId: nanoid() })
      };

      characterStore.set(characterA.characterId, characterA);
      characterStore.set(characterB.characterId, characterB);

      const characterAtWorldA = createCharacterAtWorld({
        character: characterA
      });

      const characterAtWorldB = createCharacterAtWorld({
        character: characterB
      });

      characterAtWorldStore.set(characterAtWorldA.characterId, characterAtWorldA);
      characterAtWorldStore.set(characterAtWorldB.characterId, characterAtWorldB);

      expect(encounterStore.size()).toBe(0);

      handleCharactersEncounter(
        characterAtWorldA.characterId,
        characterAtWorldB.characterId,
        world
      );

      encounterStore.forEach((encounter) => {
        const participantA = encounter.participants.find(
          (participant) => participant.characterId === characterAtWorldA.characterId
        );
        const participantB = encounter.participants.find(
          (participant) => participant.characterId === characterAtWorldB.characterId
        );

        expect(characterA.encounterId).toBe(encounter.encounterId);
        expect(characterB.encounterId).toBe(encounter.encounterId);

        expect(characterA.encounterStartTime - encounterStartTime).toBeLessThan(
          10
        );
        expect(characterB.encounterStartTime - encounterStartTime).toBeLessThan(
          10
        );
        expect(characterA.encounterStartTime).toBe(characterB.encounterStartTime);

        expect(participantA).toEqual(
          expect.objectContaining({ characterId: characterAtWorldA.characterId })
        );
        expect(participantB).toEqual(
          expect.objectContaining({ characterId: characterAtWorldB.characterId })
        );
      });

      expect(encounterStore.size()).toBe(1);
      expect(characterAtWorldStore.size()).toBe(0);
    });

    test('Does not create encounter if characters are further than ENCOUNTER_DISTANCE', () => {
      const encounterStartTime = moment().subtract(50, 'seconds').valueOf();
      const world = getFakeNamespace();

      const characterA = {
        ...createCharacter({ characterId: nanoid() }),
        encounterStartTime,
        coordinates: { lat: 50, lng: 30 }
      };

      const characterB = {
        ...createCharacter({ characterId: nanoid() }),
        encounterStartTime,
        coordinates: { lat: 40, lng: 30 }
      };

      characterStore.set(characterA.characterId, characterA);
      characterStore.set(characterB.characterId, characterB);

      const characterAtWorldA = {
        ...createCharacterAtWorld({
          character: characterA
        })
      } as CharacterAtWorld;

      const characterAtWorldB = {
        ...createCharacterAtWorld({
          character: characterB
        }),
        charactersInSight: [],
        encountersInSight: []
      } as CharacterAtWorld;

      characterAtWorldStore.set(characterAtWorldA.characterId, characterAtWorldA);
      characterAtWorldStore.set(characterAtWorldB.characterId, characterAtWorldB);

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

    test('Does not create encounter if both characters have' +
      ' encounterStartTime', () => {
      const encounterStartTime = moment().subtract(50, 'seconds').valueOf();
      const world = getFakeNamespace();

      const characterA = {
        ...createCharacter({ characterId: nanoid() }),
        encounterStartTime
      };

      const characterB = {
        ...createCharacter({ characterId: nanoid() }),
        encounterStartTime
      };

      characterStore.set(characterA.characterId, characterA);
      characterStore.set(characterB.characterId, characterB);

      const characterAtWorldA = {
        ...createCharacterAtWorld({
          character: characterA
        }),
        charactersInSight: [],
        encountersInSight: []
      } as CharacterAtWorld;

      const characterAtWorldB = {
        ...createCharacterAtWorld({
          character: characterB
        }),
        charactersInSight: [],
        encountersInSight: []
      } as CharacterAtWorld;

      characterAtWorldStore.set(characterAtWorldA.characterId, characterAtWorldA);
      characterAtWorldStore.set(characterAtWorldB.characterId, characterAtWorldB);

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

    test(`Does not create encounter if encounterEndTime is less than ENCOUNTER_COOL_DOWN_TIME`, () => {
      const world = getFakeNamespace();
      const encounterEndTime = moment()
        .subtract(ENCOUNTER_COOL_DOWN_TIME - 1, 'seconds')
        .valueOf();

      const characterA = {
        ...createCharacter({ characterId: nanoid() }),
        encounterEndTime
      };

      const characterB = {
        ...createCharacter({ characterId: nanoid() })
      };

      characterStore.set(characterA.characterId, characterA);
      characterStore.set( characterB.characterId,  characterB);

      const characterAtWorldA = {
        ...createCharacterAtWorld({
          character: characterA
        }),
        charactersInSight: [],
        encountersInSight: []
      } as CharacterAtWorld;

      const characterAtWorldB = {
        ...createCharacterAtWorld({
          character:  characterB
        }),
        charactersInSight: [],
        encountersInSight: []
      } as CharacterAtWorld;

      characterAtWorldStore.set(characterAtWorldA.characterId, characterAtWorldA);
      characterAtWorldStore.set(characterAtWorldB.characterId, characterAtWorldB);

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
