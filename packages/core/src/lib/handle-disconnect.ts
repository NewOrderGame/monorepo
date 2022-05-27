import { Namespace, Socket } from 'socket.io';
import sessionStore from '../store/session-store';
import logger from './logger';
import { NogNamespace } from '@newordergame/common';

export async function handleDisconnect(
  namespaceName: NogNamespace,
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
