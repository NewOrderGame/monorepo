import characterStore from '../store/character-store';
import * as moment from 'moment';
import logger from './utils/logger';
import {
  Encounter,
  EncounterParticipant,
  NogEvent,
  NogPage
} from '@newordergame/common';
import encounterStore from '../store/encounter-store';
import { Namespace, Socket } from 'socket.io';
import { GetUserResponse } from 'aws-sdk/clients/cognitoidentityserviceprovider';
import { getUser } from './utils/cognito';
import { handleDisconnect } from './utils/handle-disconnect';

export const handleEncounterInit = (socket: Socket) => async () => {
  logger.info('Encounter init', { socketId: socket.id });
  const accessToken = socket.handshake.auth.accessToken;

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
    socket.emit(NogEvent.REDIRECT, {
      page: NogPage.CHARACTER
    });
    return;
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
};

export const handleExit =
  (socket: Socket, encounterNamespace: Namespace) => () => {
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

    socket.emit(NogEvent.REDIRECT, {
      page: NogPage.WORLD
    });

    encounterNamespace.to(characterB.characterId).emit(NogEvent.REDIRECT, {
      page: NogPage.WORLD
    });
  };

export const handleEncounterConnection =
  (encounterNamespace: Namespace) => (socket: Socket) => {
    logger.info('Encounter connected', { socketId: socket.id });

    socket.on(NogEvent.INIT, handleEncounterInit(socket));
    socket.on(NogEvent.EXIT, handleExit(socket, encounterNamespace));
    socket.on(
      NogEvent.DISCONNECT,
      handleEncounterDisconnect(socket, encounterNamespace)
    );
  };

const handleEncounterDisconnect =
  (socket: Socket, encounterNamespace: Namespace) => async () =>
    await handleDisconnect(socket, encounterNamespace);
