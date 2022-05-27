import { Encounter, NogEvent, Page } from '@newordergame/common';
import encounterStore from '../store/encounter-store';
import sessionStore from '../store/session-store';
import { io } from '../io';
import { Namespace, Socket } from 'socket.io';
import cognito from '../lib/cognito';
import { createSession } from '../lib/session';
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

        socket.data.sessionId = username;

        let session = sessionStore.get(username);
        if (!session) {
          session = createSession({ sessionId: username });
        }

        if (session.page === Page.ENCOUNTER) {
          const encounter: Encounter = encounterStore.get(session.encounterId);
          if (encounter) {
            socket.emit(NogEvent.INIT, {
              participants: encounter.participants
            });
          }
        }
        sessionStore.set(session.sessionId, { ...session, connected: true });
        socket.join(session.sessionId);
      }
    );
  });

  socket.on(NogEvent.EXIT, () => {
    if (!socket.data.sessionId) {
      logger.error('There should be session ID');
    }
    const sessionA = sessionStore.get(socket.data.sessionId);
    const encounter = encounterStore.get(sessionA.encounterId);
    if (!encounter) {
      return logger.error('There should be an encounter');
    }
    const sessionB = sessionStore.get(
      encounter.participants.find((p) => p.characterId !== sessionA.sessionId)
        .characterId
    );

    sessionA.encounterId = null;
    sessionA.page = Page.WORLD;
    sessionA.encounterEndTime = moment().valueOf();
    sessionA.encounterStartTime = null;
    sessionA.coordinates = encounter.coordinates;
    sessionStore.set(sessionA.sessionId, {
      ...sessionA
    });

    sessionB.encounterId = null;
    sessionB.page = Page.WORLD;
    sessionB.encounterEndTime = moment().valueOf();
    sessionB.encounterStartTime = null;
    sessionB.coordinates = encounter.coordinates;
    sessionStore.set(sessionB.sessionId, {
      ...sessionB
    });

    encounterStore.delete(encounter.encounterId);

    getEncounter().to(sessionA.sessionId).emit(NogEvent.REDIRECT, {
      page: Page.WORLD
    });

    getEncounter().to(sessionB.sessionId).emit(NogEvent.REDIRECT, {
      page: Page.WORLD
    });
  });

  socket.on(
    NogEvent.DISCONNECT,
    async () => await handleDisconnect('Encounter', socket, encounterNamespace)
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
