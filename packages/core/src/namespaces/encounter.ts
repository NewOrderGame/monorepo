import { nanoid } from 'nanoid';
import {
  DEFAULT_COORDINATES,
  errorWithLogout,
  Session
} from '@newordergame/common';
import sessionStore from '../store/sessionStore';
import characterStore from '../store/characterStore';
import { io } from '../io';
import { Namespace, Socket } from 'socket.io';

let encounter: Namespace;

function handleEncounterConnection(socket: Socket) {
  const sessionId = socket.handshake.auth.sessionId;
  // TODO: send UserID instead of Username, use Cognito
  const username = socket.handshake.auth.username;
  let session: Session;

  if (sessionId) {
    session = sessionStore.get(sessionId);
    if (session) {
      console.log(`Found existing session for ${session.username}`);
      socket.data.sessionId = sessionId;
      session.connected = true;
      sessionStore.set(sessionId, session);
    } else {
      return errorWithLogout('Invalid session ID', socket);
    }
  } else if (username) {
    const sessionId = nanoid();
    const userId = nanoid();
    socket.data.sessionId = sessionId;
    session = {
      sessionId,
      userId,
      username,
      coordinates: DEFAULT_COORDINATES,
      connected: true,
      page: 'encounter'
    };
    sessionStore.set(sessionId, session);
    console.log(`Created new session for ${username}`);
  } else {
    return errorWithLogout('No SessionID, no Username.', socket);
  }
  console.log('Connected', socket.id, session.username);

  socket.emit('session', {
    sessionId: session.sessionId,
    username: session.username,
    userId: session.userId,
    coordinates: session.coordinates,
    page: session.page
  });

  socket.join(session.userId);

  socket.on('disconnect', async () => {
    const session = sessionStore.get(socket.data.sessionId);
    console.log('Disconnect', socket.id);
    const matchingSockets = await encounter.in(session.userId).allSockets();
    const isDisconnected = matchingSockets.size === 0;
    if (isDisconnected) {
      sessionStore.set(session.sessionId, {
        ...session,
        connected: false
      });
      characterStore.delete(session.userId);
    }
  });
}

export function initEncounter() {
  console.log('Init Encounter');
  encounter = io.of('/encounter');
  encounter.on('connection', handleEncounterConnection);
}

export function getEncounter() {
  return encounter;
}
