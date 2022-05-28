import { Namespace, Socket } from 'socket.io';
import characterStore from '../store/character-store';
import logger from './logger';
import { NogNamespace } from '@newordergame/common';

export async function handleDisconnect(
  namespaceName: NogNamespace,
  socket: Socket,
  namespace: Namespace
) {
  logger.info('Disconnected', { namespaceName, socketId: socket.id });
  const character = characterStore.get(socket.data.characterId);
  if (character) {
    logger.info('Disconnected with character ID', {
      characterId: character.characterId
    });
    const matchingSockets = await namespace
      .in(character.characterId)
      .allSockets();
    const isDisconnected = matchingSockets.size === 0;
    if (isDisconnected) {
      characterStore.set(character.characterId, {
        ...character,
        connected: false
      });
    }
  } else {
    logger.info('Disconnected without character ID');
  }
}
