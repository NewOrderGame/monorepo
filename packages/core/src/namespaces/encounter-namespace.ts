import {
  Encounter,
  EncounterParticipant,
  NogEvent,
  NogNamespace,
  NogPage
} from '@newordergame/common';
import encounterStore from '../store/encounter-store';
import characterStore from '../store/character-store';
import { io } from '../io';
import { Namespace, Socket } from 'socket.io';
import cognito from '../lib/cognito';
import { createCharacter } from '../lib/character';
import * as moment from 'moment';
import { handleDisconnect } from '../lib/handle-disconnect';
import logger from '../lib/logger';

let encounterNamespace: Namespace;

function handleEncounterConnection(socket: Socket) {
  logger.info('Encounter connected', { socketId: socket.id });

  const accessToken = socket.handshake.auth.accessToken;

  socket.on(NogEvent.INIT, () => {
    logger.info('Encounter init', { socketId: socket.id });
    cognito.getUser(
      {
        AccessToken: accessToken
      },
      (error, response) => {
        if (error) {
          return logger.error(error);
        }
        if (!response) {
          return logger.error('There should be a response');
        }
        const username = response?.Username;

        socket.data.characterId = username;

        let character = characterStore.get(username);
        if (!character) {
          character = createCharacter({ characterId: username });
        }

        if (character.page === NogPage.ENCOUNTER) {
          const encounter: Encounter = encounterStore.get(character.encounterId);
          if (encounter) {
            socket.emit(NogEvent.INIT, {
              participants: encounter.participants
            });
          }
        }
        characterStore.set(character.characterId, { ...character, connected: true });
        socket.join(character.characterId);
      }
    );
  });

  socket.on(NogEvent.EXIT, () => {
    if (!socket.data.characterId) {
      logger.error('There should be character ID');
    }
    const characterA = characterStore.get(socket.data.characterId);
    const encounter = encounterStore.get(characterA.encounterId);
    if (!encounter) {
      return logger.error('There should be an encounter');
    }
    const characterB = characterStore.get(
      encounter.participants.find(
        (p: EncounterParticipant) => p.characterId !== characterA.characterId
      ).characterId
    );

    characterA.encounterId = null;
    characterA.page = NogPage.WORLD;
    characterA.encounterEndTime = moment().valueOf();
    characterA.encounterStartTime = null;
    characterA.coordinates = encounter.coordinates;
    characterStore.set(characterA.characterId, {
      ...characterA
    });

    characterB.encounterId = null;
    characterB.page = NogPage.WORLD;
    characterB.encounterEndTime = moment().valueOf();
    characterB.encounterStartTime = null;
    characterB.coordinates = encounter.coordinates;
    characterStore.set(characterB.characterId, {
      ...characterB
    });

    encounterStore.delete(encounter.encounterId);

    getEncounter().to(characterA.characterId).emit(NogEvent.REDIRECT, {
      page: NogPage.WORLD
    });

    getEncounter().to(characterB.characterId).emit(NogEvent.REDIRECT, {
      page: NogPage.WORLD
    });
  });

  socket.on(
    NogEvent.DISCONNECT,
    async () =>
      await handleDisconnect(NogNamespace.ENCOUNTER, socket, encounterNamespace)
  );
}

export function initEncounter() {
  logger.info('Init Encounter');
  encounterNamespace = io.of('/encounter');
  encounterNamespace.on(NogEvent.CONNECTION, handleEncounterConnection);
}

export function getEncounter() {
  return encounterNamespace;
}
