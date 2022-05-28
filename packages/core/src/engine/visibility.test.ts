import 'dotenv/config';
import {
  checkCharacterVisibility,
  checkEncounterVisibility,
  sendCharactersInSight,
  sendEncountersInSight
} from './visibility';
import {
  CharacterAtWorld,
  CharacterInSight,
  Encounter,
  EncounterInSight,
  NogEvent,
  Character
} from '@newordergame/common';
import characterAtWorldStore from '../store/character-at-world-store';
import { nanoid } from 'nanoid';
import { createCharacterAtWorld } from '../lib/character-at-world';
import encounterStore from '../store/encounter-store';
import { getFakeNamespace } from '../test/utils';

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
          coordinates: { lat: 0, lng: 0 }
        } as Character
      }),
      charactersInSight: [],
      encountersInSight: []
    } as CharacterAtWorld,
    {
      ...createCharacterAtWorld({
        character: {
          characterId: nanoid(),
          nickname: 'B',
          coordinates: { lat: 0, lng: 0 }
        } as Character
      }),
      charactersInSight: [],
      encountersInSight: []
    } as CharacterAtWorld
  ]
} as Encounter;

describe('Visibility module', () => {
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
            coordinates: { lat: 46.47684829298625, lng: 30.730953812599186 }
          } as Character
        }),
        charactersInSight: charactersInSightA,
        encountersInSight: []
      } as CharacterAtWorld;

      const characterAtWorldB = {
        ...createCharacterAtWorld({
          character: {
            characterId: nanoid(),
            nickname: 'B',
            coordinates: { lat: 46.47684829298625, lng: 30.730953812599186 }
          } as Character
        })
      } as CharacterAtWorld;

      characterAtWorldStore.set(characterAtWorldA.characterId, characterAtWorldA);
      characterAtWorldStore.set(characterAtWorldB.characterId, characterAtWorldB);

      checkCharacterVisibility(
        characterAtWorldA.characterId,
        characterAtWorldB.characterId,
        charactersInSightA,
        charactersInSightB
      );

      expect(charactersInSightA.length).toBe(1);
      expect(characterAtWorldA.characterSightFlag).toBe(true);
      expect(
        characterAtWorldStore.get(characterAtWorldA.characterId).characterSightFlag
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
            coordinates: { lat: 46.47684829298625, lng: 30.730953812599186 }
          } as Character
        }),
        charactersInSight: charactersInSightA
      };

      const characterAtWorldB = {
        ...createCharacterAtWorld({
          character: {
            characterId: nanoid(),
            nickname: 'B',
            coordinates: { lat: 46.47651581453476, lng: 30.73301374912262 }
          } as Character
        })
      } as CharacterAtWorld;

      characterAtWorldStore.set(characterAtWorldA.characterId, characterAtWorldA);
      characterAtWorldStore.set(characterAtWorldB.characterId, characterAtWorldB);

      checkCharacterVisibility(
        characterAtWorldA.characterId,
        characterAtWorldB.characterId,
        charactersInSightA,
        charactersInSightB
      );

      expect(charactersInSightA.length).toBe(0);
      expect(characterAtWorldA.characterSightFlag).toBe(false);
      expect(
        characterAtWorldStore.get(characterAtWorldA.characterId).characterSightFlag
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
            coordinates: { lat: 46.47684829298625, lng: 30.730953812599186 }
          } as Character
        }),
        charactersInSight
      };

      characterAtWorld.characterSightFlag = true;

      characterAtWorldStore.set(characterAtWorld.characterId, characterAtWorld);

      sendCharactersInSight(characterAtWorld.characterId, charactersInSight, world);

      expect(characterAtWorld.characterSightFlag).toBe(false);
      expect(characterAtWorldStore.get(characterAtWorld.characterId).characterSightFlag).toBe(
        false
      );
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
            coordinates: { lat: 46.47684829298625, lng: 30.730953812599186 }
          } as Character
        }),
        charactersInSight
      };

      characterAtWorld.characterSightFlag = false;

      characterAtWorldStore.set(characterAtWorld.characterId, characterAtWorld);

      sendCharactersInSight(characterAtWorld.characterId, charactersInSight, world);

      expect(characterAtWorld.characterSightFlag).toBe(false);
      expect(charactersInSight.length).toBe(0);
      expect(characterAtWorldStore.get(characterAtWorld.characterId).characterSightFlag).toBe(
        false
      );
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
            coordinates: { lat: 46.47684829298625, lng: 30.730953812599186 }
          } as Character
        }),
        charactersInSight: [],
        encountersInSight
      } as CharacterAtWorld;

      const encounter = {
        ...DEFAULT_ENCOUNTER,
        encounterId: nanoid(),
        coordinates: { lat: 46.47684829298625, lng: 30.730953812599186 }
      } as Encounter;

      characterAtWorldStore.set(characterAtWorld.characterId, characterAtWorld);
      encounterStore.set(encounter.encounterId, encounter);

      checkEncounterVisibility(
        characterAtWorld.characterId,
        encounter.encounterId,
        encountersInSight
      );

      expect(encountersInSight.length).toBe(1);
      expect(characterAtWorld.encounterSightFlag).toBe(true);
      expect(characterAtWorldStore.get(characterAtWorld.characterId).encounterSightFlag).toBe(
        true
      );
    });

    test('Character should not see Encounter', () => {
      const encountersInSight: EncounterInSight[] = [];

      const characterAtWorld = {
        ...createCharacterAtWorld({
          character: {
            characterId: nanoid(),
            nickname: 'A',
            coordinates: { lat: 46.47684829298625, lng: 30.730953812599186 }
          } as Character
        }),
        charactersInSight: [],
        encountersInSight
      } as CharacterAtWorld;

      const encounter = {
        ...DEFAULT_ENCOUNTER,
        encounterId: nanoid(),
        coordinates: { lat: 46.47651581453476, lng: 30.73301374912262 }
      } as Encounter;

      characterAtWorldStore.set(characterAtWorld.characterId, characterAtWorld);
      encounterStore.set(encounter.encounterId, encounter);

      checkEncounterVisibility(
        characterAtWorld.characterId,
        encounter.encounterId,
        encountersInSight
      );

      expect(encountersInSight.length).toBe(0);
      expect(characterAtWorld.encounterSightFlag).toBe(false);
      expect(characterAtWorldStore.get(characterAtWorld.characterId).encounterSightFlag).toBe(
        false
      );
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
            coordinates: { lat: 46.47684829298625, lng: 30.730953812599186 }
          } as Character
        }),
        charactersInSight: [],
        encountersInSight
      } as CharacterAtWorld;

      characterAtWorld.encounterSightFlag = true;

      characterAtWorldStore.set(characterAtWorld.characterId, characterAtWorld);

      sendEncountersInSight(characterAtWorld.characterId, encountersInSight, world);

      expect(encountersInSight.length).toBe(0);
      expect(characterAtWorld.encounterSightFlag).toBe(false);
      expect(characterAtWorldStore.get(characterAtWorld.characterId).encounterSightFlag).toBe(
        false
      );
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
            coordinates: { lat: 46.47684829298625, lng: 30.730953812599186 }
          } as Character
        }),
        charactersInSight: [],
        encountersInSight
      } as CharacterAtWorld;

      characterAtWorld.encounterSightFlag = false;

      characterAtWorldStore.set(characterAtWorld.characterId, characterAtWorld);

      sendEncountersInSight(characterAtWorld.characterId, encountersInSight, world);

      expect(encountersInSight.length).toBe(0);
      expect(characterAtWorld.encounterSightFlag).toBe(false);
      expect(characterAtWorldStore.get(characterAtWorld.characterId).encounterSightFlag).toBe(
        false
      );
      expect(world.to(characterAtWorld.characterId).emit).not.toBeCalled();
    });
  });
});
