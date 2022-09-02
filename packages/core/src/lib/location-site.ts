import { Namespace, Socket } from 'socket.io';
import logger from './utils/logger';
import { Coordinates } from '@newordergame/common';
import {
  getLocationSiteSocket,
  setLocationSiteSocket
} from '../store/location-site-socket-store';

export const handleLocationSiteServiceConnection = (
  socket: Socket,
  gameNamespace: Namespace
) => {
  const isLocationSiteService =
    socket.handshake.auth.locationSiteServiceSecret ===
    'LOCATION_SITE_SERVICE_SECRET';

  if (!isLocationSiteService) {
    return;
  }

  logger.info('Location Site service connected');
  setLocationSiteSocket(socket);

  socket.on(
    'enter-building-commit',
    handleEnterBuildingCommit(socket, gameNamespace)
  );
};

export const handleEnterBuilding =
  (socket: Socket) => (coordinates: Coordinates) => {
    const locationSiteSocket = getLocationSiteSocket();
    const characterId = socket.data.characterId;

    if (!characterId) throw new Error('Character ID is missing');

    locationSiteSocket.emit('enter-building', {
      characterId,
      coordinates
    });
  };

export const handleEnterBuildingCommit =
  (socket: Socket, gameNamespace: Namespace) =>
  ({ characterId, map }: { characterId: string; map: any }) => {
    gameNamespace.to(characterId).emit('enter-building', map);
    logger.info('Sent enter-building');
  };
