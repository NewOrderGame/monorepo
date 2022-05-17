import { io } from '../io';
import sessionStore from '../store/session-store';
import { Namespace, Socket } from 'socket.io';
import { createSession, determinePage } from '../utils/session';
import cognito from '../utils/cognito';
import { handleDisconnect } from '../utils/handle-disconnect';
import logger from '../utils/logger';

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
      if (error) return logger.error(error);

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

      socket.emit('redirect', {
        page: session.page
      });
      logger.info('Auth sent redirect', {
        page: session.page,
        nickname: session.nickname
      });
    }
  );

  socket.on(
    'disconnect',
    async () => await handleDisconnect('Auth', socket, authNamespace)
  );
}

export function initAuth() {
  logger.info('Init Auth');
  authNamespace = io.of('/auth');
  authNamespace.on('connection', handleAuthConnection);
}

export function getAuth(): Namespace {
  return authNamespace;
}
