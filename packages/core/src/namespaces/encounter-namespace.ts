import {
  Encounter,
  EncounterParticipant,
  NogEvent,
  NogNamespace,
  NogPage
} from '@newordergame/common';
import { io } from '../io';
import encounterStore from '../store/encounter-store';
import characterStore from '../store/character-store';
import logger from '../lib/utils/logger';
import { Namespace, Socket } from 'socket.io';
import { getUser } from '../lib/utils/cognito';
import * as moment from 'moment';
import { handleDisconnect } from '../lib/utils/handle-disconnect';
import { GetUserResponse } from 'aws-sdk/clients/cognitoidentityserviceprovider';

let encounterNamespace: Namespace;

const handleEncounterConnection = (socket: Socket) => {
  logger.info('Encounter connected', { socketId: socket.id });

  const accessToken = socket.handshake.auth.accessToken;

  const handleInit = async () => {
    logger.info('Encounter init', { socketId: socket.id });
    let user: GetUserResponse;
    try {
      user = await getUser(accessToken);
    } catch (error) {
      logger.error('Error during getting user in Encounter Namespace', error);
      return;
    }
    const username = user?.Username;
    socket.data.characterId = username;

    let character = characterStore.get(username);
    if (!character) {
      return socket.emit(NogEvent.REDIRECT, {
        page: NogPage.CHARACTER
      });
    }

    if (character.page === NogPage.ENCOUNTER) {
      const encounter: Encounter = encounterStore.get(character.encounterId);
      if (encounter) {
        socket.emit(NogEvent.INIT, {
          participants: encounter.participants
        });
      }
    }
    characterStore.set(character.characterId, {
      ...character,
      connected: true
    });
    socket.join(character.characterId);
  }

  const handleExit = () => {
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
  }

  socket.on(NogEvent.INIT, handleInit);

  socket.on(NogEvent.EXIT, handleExit);

  socket.on(
    NogEvent.DISCONNECT,
    async () =>
      await handleDisconnect(NogNamespace.ENCOUNTER, socket, encounterNamespace)
  );
}

export const initEncounter = () => {
  logger.info('Init Encounter');
  encounterNamespace = io.of('/encounter');
  encounterNamespace.on(NogEvent.CONNECTION, handleEncounterConnection);
}

export const getEncounter = () => {
  return encounterNamespace;
}
