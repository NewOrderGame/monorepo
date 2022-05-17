import { io } from '../io';
import sessionStore from '../store/sessionStore';
import { Namespace, Socket } from 'socket.io';
import { createSession, determinePage } from '../utils/session';
import cognito from '../utils/cognito';
import { handleDisconnect } from "../utils";

let authNamespace: Namespace;

function handleAuthConnection(socket: Socket) {
  console.log('Auth connected', socket.id);
  const accessToken = socket.handshake.auth.accessToken;

  cognito.getUser(
    {
      AccessToken: accessToken
    },
    (error, response) => {
      if (error) {
        return console.error(error);
      }
      if (!response) {
        return console.error(new Error('There should be a response'));
      }
      const username = response.Username;
      const nickname: string = response.UserAttributes.find(
        (a) => a.Name === 'nickname'
      )?.Value;
      if (error) return console.error(error);

      let session = sessionStore.get(username);
      if (!session) {
        session = createSession({
          sessionId: username,
          nickname
        });
      }

      session.page = determinePage(session);
      sessionStore.set(session.sessionId, { ...session });

      socket.emit('redirect', {
        page: session.page
      });
      console.log(`Auth sent redirect to ${session.page} to ${session.nickname}`);
    }
  );

  socket.on('disconnect', async () => await handleDisconnect('Auth', socket, authNamespace));
}

export function initAuth() {
  console.log('Init Auth');
  authNamespace = io.of('/auth');
  authNamespace.on('connection', handleAuthConnection);
}

export function getAuth(): Namespace {
  return authNamespace;
}
