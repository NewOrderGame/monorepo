import { Encounter, Page } from '@newordergame/common';
import encounterStore from '../store/encounterStore';
import sessionStore from '../store/sessionStore';
import { io } from '../io';
import { Namespace, Socket } from 'socket.io';
import cognito from '../utils/cognito';
import { createSession } from '../utils/session';
import * as moment from 'moment';
import { handleDisconnect } from '../utils/handleDisconnect';
import logger from '../utils/logger';

let encounterNamespace: Namespace;

function handleEncounterConnection(socket: Socket) {
  logger.info('Encounter connected', { socketId: socket.id });

  const accessToken = socket.handshake.auth.accessToken;

  socket.on('init', () => {
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
        const nickname: string = response?.UserAttributes.find(
          (a) => a.Name === 'nickname'
        )?.Value;

        socket.data.sessionId = username;

        let session = sessionStore.get(username);
        if (!session) {
          session = createSession({ sessionId: username });
        }

        if (session.page === Page.ENCOUNTER) {
          const encounter: Encounter = encounterStore.get(session.encounterId);
          if (encounter) {
            socket.emit('init', {
              participants: encounter.participants
            });
          }
        }
        sessionStore.set(session.sessionId, { ...session, connected: true });
        socket.join(session.sessionId);
      }
    );
  });

  socket.on('exit', () => {
    if (!socket.data.sessionId) {
      logger.error('There should be session ID');
    }
    const session = sessionStore.get(socket.data.sessionId);
    const encounter = encounterStore.get(session.encounterId);
    if (!encounter) {
      return logger.error('There should be an encounter');
    }
    const sessionB = sessionStore.get(
      encounter.participants.find((p) => p.characterId !== session.sessionId)
        .characterId
    );

    session.encounterId = null;
    session.page = Page.WORLD;
    session.encounterEndTime = moment().valueOf();
    session.coordinates = encounter.coordinates;
    sessionStore.set(session.sessionId, {
      ...session
    });

    sessionB.encounterId = null;
    sessionB.page = Page.WORLD;
    sessionB.encounterEndTime = moment().valueOf();
    sessionB.coordinates = encounter.coordinates;
    sessionStore.set(sessionB.sessionId, {
      ...sessionB
    });

    encounterStore.delete(encounter.encounterId);

    getEncounter().to(session.sessionId).emit('redirect', {
      page: Page.WORLD
    });

    getEncounter().to(sessionB.sessionId).emit('redirect', {
      page: Page.WORLD
    });
  });

  socket.on(
    'disconnect',
    async () => await handleDisconnect('Encounter', socket, encounterNamespace)
  );
}

export function initEncounter() {
  logger.info('Init Encounter');
  encounterNamespace = io.of('/encounter');
  encounterNamespace.on('connection', handleEncounterConnection);
}

export function getEncounter() {
  return encounterNamespace;
}
