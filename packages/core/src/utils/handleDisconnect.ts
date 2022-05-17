import { Namespace, Socket } from 'socket.io';
import sessionStore from '../store/sessionStore';
import logger from './logger';

export async function handleDisconnect(
  namespaceName: string,
  socket: Socket,
  namespace: Namespace
) {
  logger.info('Disconnected', { namespaceName, socketId: socket.id });
  const session = sessionStore.get(socket.data.sessionId);
  if (session) {
    logger.info('Disconnected with session ID', {
      sessionId: session.sessionId
    });
    const matchingSockets = await namespace.in(session.sessionId).allSockets();
    const isDisconnected = matchingSockets.size === 0;
    if (isDisconnected) {
      sessionStore.set(session.sessionId, {
        ...session,
        connected: false
      });
    }
  } else {
    logger.info('Disconnected without session ID');
  }
}
