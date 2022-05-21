import 'dotenv/config';
import {
  checkCharacterVisibility,
  checkEncounterVisibility,
  sendCharactersInSight,
  sendEncountersInSight
} from './visibility';
import {
  Character,
  CharacterInSight,
  Encounter,
  EncounterInSight,
  NogEvent,
  Session
} from '@newordergame/common';
import characterStore from '../store/character-store';
import { nanoid } from 'nanoid';
import { createCharacter } from '../utils/character';
import { Socket } from 'socket.io';
import encounterStore from '../store/encounter-store';

const getFakeSocket = () =>
  ({
    emit: jest.fn()
  } as unknown as Socket);

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
  beforeEach(() => {
    characterStore.clear();
    encounterStore.clear();
  });

  describe('checkCharacterVisibility. Determines whether characterB is visible for characterA and changes characterSightFlag', () => {
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

      characterStore.set(characterA.characterId, characterA);
      characterStore.set(characterB.characterId, characterB);

      checkCharacterVisibility(characterA, characterB, charactersInSight);

      expect(charactersInSight.length).toBe(1);
      expect(characterA.characterSightFlag).toBe(true);
      expect(
        characterStore.get(characterA.characterId).characterSightFlag
      ).toBe(true);
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
      expect(
        characterStore.get(characterA.characterId).characterSightFlag
      ).toBe(false);
    });
  });

  describe('sendCharactersInSight. Sends message and changes characterSightFlag', () => {
    test(`Should send charactersInSight and set Character A's characterSightFlag to "false"`, () => {
      const charactersInSight: CharacterInSight[] = [];
      const socket = getFakeSocket();

      const character = {
        ...createCharacter({
          session: {
            sessionId: nanoid(),
            nickname: 'A',
            coordinates: { lat: 46.47684829298625, lng: 30.730953812599186 }
          } as Session,
          socket
        }),
        charactersInSight
      };

      character.characterSightFlag = true;

      characterStore.set(character.characterId, character);

      sendCharactersInSight(character, charactersInSight);

      expect(character.characterSightFlag).toBe(false);
      expect(characterStore.get(character.characterId).characterSightFlag).toBe(
        false
      );
      expect(socket.emit).toBeCalledWith(
        NogEvent.CHARACTERS_IN_SIGHT,
        charactersInSight
      );
    });

    test('Should not send charactersInSight', () => {
      const charactersInSight: CharacterInSight[] = [];
      const socket = getFakeSocket();

      const character = {
        ...createCharacter({
          session: {
            sessionId: nanoid(),
            nickname: 'A',
            coordinates: { lat: 46.47684829298625, lng: 30.730953812599186 }
          } as Session,
          socket
        }),
        charactersInSight
      };

      character.characterSightFlag = false;

      characterStore.set(character.characterId, character);

      sendCharactersInSight(character, charactersInSight);

      expect(character.characterSightFlag).toBe(false);
      expect(charactersInSight.length).toBe(0);
      expect(characterStore.get(character.characterId).characterSightFlag).toBe(
        false
      );
      expect(socket.emit).not.toBeCalled();
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
      expect(characterStore.get(character.characterId).encounterSightFlag).toBe(
        true
      );
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
      expect(characterStore.get(character.characterId).encounterSightFlag).toBe(
        false
      );
    });
  });

  describe('sendEncountersInSight. Sends message and changes encountersSightFlag', () => {
    test(`Should send encountersInSight and set Character A's encounterSightFlag to "false"`, () => {
      const encountersInSight: EncounterInSight[] = [];
      const socket = getFakeSocket();

      const character = {
        ...createCharacter({
          session: {
            sessionId: nanoid(),
            nickname: 'A',
            coordinates: { lat: 46.47684829298625, lng: 30.730953812599186 }
          } as Session,
          socket
        }),
        charactersInSight: [],
        encountersInSight: encountersInSight
      } as Character;

      character.encounterSightFlag = true;

      characterStore.set(character.characterId, character);

      sendEncountersInSight(character, encountersInSight);

      expect(encountersInSight.length).toBe(0);
      expect(character.encounterSightFlag).toBe(false);
      expect(characterStore.get(character.characterId).encounterSightFlag).toBe(
        false
      );
      expect(socket.emit).toBeCalledWith(
        NogEvent.ENCOUNTERS_IN_SIGHT,
        encountersInSight
      );
    });

    test(`Should not send encountersInSight`, () => {
      const encountersInSight: EncounterInSight[] = [];
      const socket = getFakeSocket();

      const character = {
        ...createCharacter({
          session: {
            sessionId: nanoid(),
            nickname: 'A',
            coordinates: { lat: 46.47684829298625, lng: 30.730953812599186 }
          } as Session,
          socket
        }),
        charactersInSight: [],
        encountersInSight: encountersInSight
      } as Character;

      character.encounterSightFlag = false;

      characterStore.set(character.characterId, character);

      sendEncountersInSight(character, encountersInSight);

      expect(encountersInSight.length).toBe(0);
      expect(character.encounterSightFlag).toBe(false);
      expect(characterStore.get(character.characterId).encounterSightFlag).toBe(
        false
      );
      expect(socket.emit).not.toBeCalled();
    });
  });
});
