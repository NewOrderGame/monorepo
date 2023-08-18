import { NogEvent } from '@newordergame/common';
import { io } from '../lib/utils/io';
import { logger } from '@newordergame/common';
import { Namespace, Socket } from 'socket.io';
import { handleDisconnect } from '../lib/utils/handle-disconnect';
import { handleNpcServiceConnection } from '../lib/npc';
import { handleLocationSiteBuilderServiceConnection } from '../lib/location-site';
import { handleUserConnection } from '../lib/user';

export const initGameNamespace = () => {
  logger.info('Init Game');
  const gameNamespace = io.of('/game');
  gameNamespace.on(NogEvent.CONNECTION, handleGameConnection(gameNamespace));
  return gameNamespace;
};

const handleGameConnection =
  (gameNamespace: Namespace) => async (socket: Socket) => {
    logger.info({ socketId: socket.id }, 'Game connected');

    handleNpcServiceConnection(socket);
    handleLocationSiteBuilderServiceConnection(socket, gameNamespace);
    await handleUserConnection(socket, gameNamespace);

    socket.on(NogEvent.DISCONNECT, () =>
      handleDisconnect(socket, gameNamespace)
    );
  };
