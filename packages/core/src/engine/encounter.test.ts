import characterStore from '../store/character-store';
import encounterStore from '../store/encounter-store';
import { createCharacter } from '../utils/character';
import { nanoid } from 'nanoid';
import { Character } from '@newordergame/common';
import { Socket } from 'socket.io';
import { handleCharactersEncounter } from './encounter';
import { createSession } from '../utils/session';
import sessionStore from '../store/session-store';
import moment = require('moment');
import { ENCOUNTER_COOL_DOWN_TIME } from '../utils/constants';

const getFakeSocket = () =>
  ({
    emit: jest.fn(),
    data: {}
  } as unknown as Socket);

describe('Visibility module', () => {
  beforeEach(() => {
    characterStore.clear();
    encounterStore.clear();
    sessionStore.clear();
  });

  describe('handleCharactersEncounter. Handles encounter between characters on map', () => {
    test('Creates encounter if characters are closer than ENCOUNTER_DISTANCE', () => {
      const currentTick = moment().valueOf();

      const sessionA = {
        ...createSession({ sessionId: nanoid() })
      };

      const sessionB = {
        ...createSession({ sessionId: nanoid() })
      };

      sessionStore.set(sessionA.sessionId, sessionA);
      sessionStore.set(sessionB.sessionId, sessionB);

      const characterA = {
        ...createCharacter({
          session: sessionA,
          socket: getFakeSocket()
        }),
      } as Character;

      characterA.socket.data.sessionId = sessionA.sessionId;

      const characterB = {
        ...createCharacter({
          session: sessionB,
          socket: getFakeSocket()
        }),
      } as Character;

      characterB.socket.data.sessionId = sessionB.sessionId;

      characterStore.set(characterA.characterId, characterA);
      characterStore.set(characterB.characterId, characterB);

      expect(encounterStore.size()).toBe(0);

      handleCharactersEncounter(characterA, characterB, currentTick);

      encounterStore.forEach((encounter) => {
        const participantA = encounter.participants.find(
          (participant) => participant.characterId === characterA.characterId
        );
        const participantB = encounter.participants.find(
          (participant) => participant.characterId === characterB.characterId
        );

        expect(sessionA.encounterId).toBe(encounter.encounterId);
        expect(sessionB.encounterId).toBe(encounter.encounterId);

        expect(sessionA.encounterStartTime).toBe(currentTick);
        expect(sessionB.encounterStartTime).toBe(currentTick);

        expect(participantA).toEqual(
          expect.objectContaining({ characterId: characterA.characterId })
        );
        expect(participantB).toEqual(
          expect.objectContaining({ characterId: characterB.characterId })
        );
      });

      expect(encounterStore.size()).toBe(1);
      expect(characterStore.size()).toBe(0);
    });

    test(`Creates encounter if session B's encounterStartTime is currentTick`, () => {
      const currentTick = moment().valueOf();

      const sessionA = {
        ...createSession({ sessionId: nanoid() })
      };

      const sessionB = {
        ...createSession({ sessionId: nanoid() }),
        encounterStartTime: currentTick
      };

      sessionStore.set(sessionA.sessionId, sessionA);
      sessionStore.set(sessionB.sessionId, sessionB);

      const characterA = {
        ...createCharacter({
          session: sessionA,
          socket: getFakeSocket()
        }),
        charactersInSight: [],
        encountersInSight: []
      } as Character;

      characterA.socket.data.sessionId = sessionA.sessionId;

      const characterB = {
        ...createCharacter({
          session: sessionB,
          socket: getFakeSocket()
        }),
        charactersInSight: [],
        encountersInSight: []
      } as Character;

      characterB.socket.data.sessionId = sessionB.sessionId;

      characterStore.set(characterA.characterId, characterA);
      characterStore.set(characterB.characterId, characterB);

      expect(encounterStore.size()).toBe(0);

      handleCharactersEncounter(characterA, characterB, currentTick);

      encounterStore.forEach((encounter) => {
        const participantA = encounter.participants.find(
          (participant) => participant.characterId === characterA.characterId
        );
        const participantB = encounter.participants.find(
          (participant) => participant.characterId === characterB.characterId
        );

        expect(sessionA.encounterId).toBe(encounter.encounterId);
        expect(sessionB.encounterId).toBe(encounter.encounterId);

        expect(sessionA.encounterStartTime).toBe(currentTick);
        expect(sessionB.encounterStartTime).toBe(currentTick);

        expect(participantA).toEqual(
          expect.objectContaining({ characterId: characterA.characterId })
        );
        expect(participantB).toEqual(
          expect.objectContaining({ characterId: characterB.characterId })
        );
      });

      expect(encounterStore.size()).toBe(1);
      expect(characterStore.size()).toBe(0);
    });

    test('Does not create encounter if both sessions have encounterStartTime', () => {
      const currentTick = moment().valueOf();
      const encounterStartTime = moment().subtract(50, 'seconds').valueOf();

      const sessionA = {
        ...createSession({ sessionId: nanoid() }),
        encounterStartTime
      };

      const sessionB = {
        ...createSession({ sessionId: nanoid() }),
        encounterStartTime
      };

      sessionStore.set(sessionA.sessionId, sessionA);
      sessionStore.set(sessionB.sessionId, sessionB);

      const characterA = {
        ...createCharacter({
          session: sessionA,
          socket: getFakeSocket()
        }),
        charactersInSight: [],
        encountersInSight: []
      } as Character;

      characterA.socket.data.sessionId = sessionA.sessionId;

      const characterB = {
        ...createCharacter({
          session: sessionB,
          socket: getFakeSocket()
        }),
        charactersInSight: [],
        encountersInSight: []
      } as Character;

      characterB.socket.data.sessionId = sessionB.sessionId;

      characterStore.set(characterA.characterId, characterA);
      characterStore.set(characterB.characterId, characterB);

      expect(encounterStore.size()).toBe(0);
      expect(characterStore.size()).toBe(2);

      handleCharactersEncounter(characterA, characterB, currentTick);

      expect(encounterStore.size()).toBe(0);
      expect(characterStore.size()).toBe(2);
    });

    test(`Does not create encounter if session B's encounterStartTime is not currentTick`, () => {
      const currentTick = moment().valueOf();
      const encounterStartTime = moment().subtract(50, 'seconds').valueOf();

      const sessionA = {
        ...createSession({ sessionId: nanoid() })
      };

      const sessionB = {
        ...createSession({ sessionId: nanoid() }),
        encounterStartTime
      };

      sessionStore.set(sessionA.sessionId, sessionA);
      sessionStore.set(sessionB.sessionId, sessionB);

      const characterA = {
        ...createCharacter({
          session: sessionA,
          socket: getFakeSocket()
        }),
        charactersInSight: [],
        encountersInSight: []
      } as Character;

      characterA.socket.data.sessionId = sessionA.sessionId;

      const characterB = {
        ...createCharacter({
          session: sessionB,
          socket: getFakeSocket()
        }),
        charactersInSight: [],
        encountersInSight: []
      } as Character;

      characterB.socket.data.sessionId = sessionB.sessionId;

      characterStore.set(characterA.characterId, characterA);
      characterStore.set(characterB.characterId, characterB);

      expect(encounterStore.size()).toBe(0);
      expect(characterStore.size()).toBe(2);

      handleCharactersEncounter(characterA, characterB, currentTick);

      expect(encounterStore.size()).toBe(0);
      expect(characterStore.size()).toBe(2);
    });

    test(`Does not create encounter if encounterEndTime is less than ENCOUNTER_COOL_DOWN_TIME`, () => {
      const currentTick = moment().valueOf();
      const encounterEndTime = moment()
        .subtract(ENCOUNTER_COOL_DOWN_TIME - 1, 'seconds')
        .valueOf();

      const sessionA = {
        ...createSession({ sessionId: nanoid() }),
        encounterEndTime
      };

      const sessionB = {
        ...createSession({ sessionId: nanoid() })
      };

      sessionStore.set(sessionA.sessionId, sessionA);
      sessionStore.set(sessionB.sessionId, sessionB);

      const characterA = {
        ...createCharacter({
          session: sessionA,
          socket: getFakeSocket()
        }),
        charactersInSight: [],
        encountersInSight: []
      } as Character;

      characterA.socket.data.sessionId = sessionA.sessionId;

      const characterB = {
        ...createCharacter({
          session: sessionB,
          socket: getFakeSocket()
        }),
        charactersInSight: [],
        encountersInSight: []
      } as Character;

      characterB.socket.data.sessionId = sessionB.sessionId;

      characterStore.set(characterA.characterId, characterA);
      characterStore.set(characterB.characterId, characterB);

      expect(encounterStore.size()).toBe(0);
      expect(characterStore.size()).toBe(2);

      handleCharactersEncounter(characterA, characterB, currentTick);

      expect(encounterStore.size()).toBe(0);
      expect(characterStore.size()).toBe(2);
    });
  });
});
