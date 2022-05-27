import { io } from '../io';
import sessionStore from '../store/session-store';
import { Namespace, Socket } from 'socket.io';
import { createSession } from '../lib/session';
import cognito from '../lib/cognito';
import { handleDisconnect } from '../lib/handle-disconnect';
import logger from '../lib/logger';
import { NogEvent } from '@newordergame/common';
import { determinePage } from "../lib/determine-page";

let authNamespace: Namespace;

function handleAuthConnection(socket: Socket) {
  logger.info('Auth connected', { socketId: socket.id });
  const accessToken = socket.handshake.auth.accessToken;

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
      const username = response.Username;
      const nickname: string = response.UserAttributes.find(
        (a) => a.Name === 'nickname'
      )?.Value;

      socket.data.sessionId = username;

      let session = sessionStore.get(username);
      if (!session) {
        session = createSession({
          sessionId: username
        });
      }

      session.page = determinePage(session);
      sessionStore.set(session.sessionId, {
        ...session,
        nickname,
        connected: true
      });
      socket.join(session.sessionId);

      socket.emit(NogEvent.REDIRECT, {
        page: session.page
      });
      logger.info('Auth sent redirect', {
        page: session.page,
        nickname: session.nickname
      });
    }
  );

  socket.on(
    NogEvent.DISCONNECT,
    async () => await handleDisconnect('Auth', socket, authNamespace)
  );
}

export function initAuth() {
  logger.info('Init Auth');
  authNamespace = io.of('/auth');
  authNamespace.on(NogEvent.CONNECTION, handleAuthConnection);
}

export function getAuth(): Namespace {
  return authNamespace;
}
