import 'dotenv/config';
import {
  checkCharacterVisibility,
  checkEncounterVisibility
} from './visibility';
import {
  Character,
  CharacterInSight,
  Encounter,
  EncounterInSight,
  Session
} from '@newordergame/common';
import characterStore from '../store/character-store';
import encounterStore from '../store/encounter-store';
import { nanoid } from 'nanoid';
import { createCharacter } from '../utils/character';
import { Socket } from 'socket.io';

const DEFAULT_ENCOUNTER = {
  encounterId: nanoid(),
  coordinates: { lat: 0, lng: 0 },
  encounterStartTime: null,
  participants: [
    {
      ...createCharacter({
        session: {
          sessionId: nanoid(),
          nickname: 'A',
          coordinates: { lat: 0, lng: 0 }
        } as Session,
        socket: {} as Socket
      }),
      charactersInSight: [],
      encountersInSight: []
    } as Character,
    {
      ...createCharacter({
        session: {
          sessionId: nanoid(),
          nickname: 'B',
          coordinates: { lat: 0, lng: 0 }
        } as Session,
        socket: {} as Socket
      }),
      charactersInSight: [],
      encountersInSight: []
    } as Character
  ]
} as Encounter;

describe('Visibility module', () => {
  describe('checkCharacterVisibility. Determines whether characterB is visible for characterA', () => {
    test('Character A should see Character B', () => {
      const charactersInSight: CharacterInSight[] = [];

      const characterA = {
        ...createCharacter({
          session: {
            sessionId: nanoid(),
            nickname: 'A',
            coordinates: { lat: 46.47684829298625, lng: 30.730953812599186 }
          } as Session,
          socket: {} as Socket
        }),
        charactersInSight,
        encountersInSight: []
      } as Character;

      const characterB = {
        ...createCharacter({
          session: {
            sessionId: nanoid(),
            nickname: 'B',
            coordinates: { lat: 46.47684829298625, lng: 30.730953812599186 }
          } as Session,
          socket: {} as Socket
        }),
        charactersInSight: [],
        encountersInSight: []
      } as Character;

      checkCharacterVisibility(characterA, characterB, charactersInSight);

      expect(charactersInSight.length).toBe(1);
      expect(characterA.characterSightFlag).toBe(true);
      expect(characterStore.get(characterA.characterId).characterSightFlag).toBe(true);
    });

    test('Character A should not see Character B', () => {
      const charactersInSight: CharacterInSight[] = [];

      const characterA = {
        ...createCharacter({
          session: {
            sessionId: nanoid(),
            nickname: 'A',
            coordinates: { lat: 46.47684829298625, lng: 30.730953812599186 }
          } as Session,
          socket: {} as Socket
        }),
        charactersInSight
      };

      const characterB = {
        ...createCharacter({
          session: {
            sessionId: nanoid(),
            nickname: 'B',
            coordinates: { lat: 46.47651581453476, lng: 30.73301374912262 }
          } as Session,
          socket: {} as Socket
        })
      } as Character;

      characterStore.set(characterA.characterId, characterA);
      characterStore.set(characterB.characterId, characterB);

      checkCharacterVisibility(characterA, characterB, charactersInSight);

      expect(charactersInSight.length).toBe(0);
      expect(characterA.characterSightFlag).toBe(false);
      expect(characterStore.get(characterA.characterId).characterSightFlag).toBe(false);
    });
  });

  describe('checkEncounterVisibility. Determines whether character sees encounter', () => {
    test('Character should see Encounter', () => {
      const encountersInSight: EncounterInSight[] = [];

      const character = {
        ...createCharacter({
          session: {
            sessionId: nanoid(),
            nickname: 'A',
            coordinates: { lat: 46.47684829298625, lng: 30.730953812599186 }
          } as Session,
          socket: {} as Socket
        }),
        charactersInSight: [],
        encountersInSight: encountersInSight
      } as Character;

      const encounter = {
        ...DEFAULT_ENCOUNTER,
        encounterId: nanoid(),
        coordinates: { lat: 46.47684829298625, lng: 30.730953812599186 }
      } as Encounter;

      characterStore.set(character.characterId, character);
      encounterStore.set(encounter.encounterId, encounter);

      checkEncounterVisibility(character, encounter, encountersInSight);

      expect(encountersInSight.length).toBe(1);
      expect(character.encounterSightFlag).toBe(true);
      expect(characterStore.get(character.characterId).encounterSightFlag).toBe(true);
    });

    test('Character should not see Encounter', () => {
      const encountersInSight: EncounterInSight[] = [];

      const character = {
        ...createCharacter({
          session: {
            sessionId: nanoid(),
            nickname: 'A',
            coordinates: { lat: 46.47684829298625, lng: 30.730953812599186 }
          } as Session,
          socket: {} as Socket
        }),
        charactersInSight: [],
        encountersInSight: encountersInSight
      } as Character;

      const encounter = {
        ...DEFAULT_ENCOUNTER,
        encounterId: nanoid(),
        coordinates: { lat: 46.47651581453476, lng: 30.73301374912262 }
      } as Encounter;

      characterStore.set(character.characterId, character);
      encounterStore.set(encounter.encounterId, encounter);

      checkEncounterVisibility(character, encounter, encountersInSight);

      expect(encountersInSight.length).toBe(0);
      expect(character.encounterSightFlag).toBe(false);
      expect(characterStore.get(character.characterId).encounterSightFlag).toBe(false);
    });
  });
});
