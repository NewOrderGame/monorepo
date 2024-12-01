import { NogEvent } from '@newordergame/common';
import { io } from './io';
import { logger } from '@newordergame/common';
import { Namespace, Socket } from 'socket.io';
import { handleDisconnect } from './handle-disconnect';
import { handleUserConnection } from './user';
import { handleEncounterServiceConnection } from './encounter';

export const initGameNamespace = () => {
  logger.info('Init Game');
  const gameNamespace = io.of('/game');
  gameNamespace.on(NogEvent.CONNECTION, handleGameConnection(gameNamespace));
  return gameNamespace;
};

const handleGameConnection =
  (gameNamespace: Namespace) => async (socket: Socket) => {
    logger.info({ socketId: socket.id }, 'Game connected');

    handleEncounterServiceConnection(socket);
    await handleUserConnection(socket, gameNamespace);

    socket.on(NogEvent.DISCONNECT, () =>
      handleDisconnect(socket, gameNamespace)
    );
  };
