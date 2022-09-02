import { Namespace, Socket } from 'socket.io';
import characterStore from '../../store/character-store';
import logger from './logger';
import { setNpcSocket } from '../../store/npc-socket-store';
import characterAtWorldStore from '../../store/character-at-world-store';
import { setLocationSiteSocket } from '../../store/location-site-socket-store';

export const handleDisconnect = async (
  socket: Socket,
  gameNamespace: Namespace
) => {
  if (!socket) {
    throw new Error('Socket is missing');
  }
  const character = characterStore.get(socket.data?.characterId);
  const characterAtWorld = characterAtWorldStore.get(socket.data?.characterId);

  if (character) {
    const matchingSockets = await gameNamespace
      .in(character.characterId)
      .allSockets();
    const isDisconnected = matchingSockets.size === 0;
    if (isDisconnected) {
      characterStore.set(character.characterId, {
        ...character,
        connected: false
      });
    }

    logger.info(
      {
        characterId: character.characterId,
        nickname: character.nickname
      },
      'Disconnected character'
    );
  } else {
    logger.info('Disconnected without character ID');
  }

  if (characterAtWorld) {
    characterAtWorldStore.delete(characterAtWorld.characterId);
  }

  const isNpcService =
    socket.handshake?.auth.npcServiceSecret === 'NPC_SERVICE_SECRET';
  if (isNpcService) {
    setNpcSocket(null);
    logger.warn('NPC service disconnected', {
      namespaceName: gameNamespace.name
    });
  }

  const isLocationSiteService =
    socket.handshake?.auth.locationSiteServiceSecret === 'LOCATION_SITE_SERVICE_SECRET';
  if (isLocationSiteService) {
    setLocationSiteSocket(null);
    logger.warn('Location Site service disconnected', {
      namespaceName: gameNamespace.name
    });
  }
};
