import { Namespace, Socket } from 'socket.io';
import sessionStore from '../store/sessionStore';

export async function handleDisconnect(
  namespaceName: string,
  socket: Socket,
  namespace: Namespace
) {
  console.log(namespaceName, 'disconnected', socket.id, '\r');
  const session = sessionStore.get(socket.data.sessionId);
  if (session) {
    console.log(namespaceName, 'disconnected socket with session:', session.sessionId);
    const matchingSockets = await namespace.in(session.sessionId).allSockets();
    const isDisconnected = matchingSockets.size === 0;
    if (isDisconnected) {
      sessionStore.set(session.sessionId, {
        ...session,
        connected: false
      });
    }
  } else {
    console.log(namespaceName, 'disconnected socket without session');
  }
}
