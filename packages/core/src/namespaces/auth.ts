import { io } from '../io';
import sessionStore from '../store/sessionStore';
import { Namespace, Socket } from 'socket.io';

let auth: Namespace;

function handleAuthConnection(socket: Socket) {
  console.log('Auth connected');
  const sessionId = socket.handshake.auth.sessionId;
  const session = sessionStore.get(sessionId);
  if (session) {
    socket.emit('get-username', { username: session.username });
    console.log(`Sent username to ${session.username}`);
  } else {
    socket.emit('get-username', { username: null });
  }
}

export function initAuth() {
  console.log('Init Auth');
  auth = io.of('/auth');
  auth.on('connection', handleAuthConnection);
}

export function getAuth(): Namespace {
  return auth;
}
