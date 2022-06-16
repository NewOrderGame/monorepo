import { Namespace, Socket } from 'socket.io';
import characterStore from '../../store/character-store';
import logger from './logger';
import npcSocketStore from '../../store/npc-socket-store';

export const handleDisconnect = async (
  socket: Socket,
  namespace: Namespace
) => {
  logger.info('Disconnected', {
    namespaceName: namespace.name,
    socketId: socket.id
  });
  if (!socket) {
    throw new Error('Socket is missing');
  }
  const character = characterStore.get(socket.data?.characterId);
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

  const isNpcService =
    socket.handshake?.auth.npcServiceSecret === 'NPC_SERVICE_SECRET';
  if (isNpcService) {
    npcSocketStore.set(namespace.name, null);
    logger.warn(`NPC service disconnected from ${namespace.name}`);
  }
};
