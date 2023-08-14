import { Namespace, Socket } from 'socket.io';
import logger from './utils/logger';
import { Coordinates, NogEvent, NogPage } from '@newordergame/common';
import {
  getLocationSiteSocket,
  setLocationSiteSocket
} from '../store/location-site-socket-store';
import characterStore from '../store/character-store';
import characterAtWorldStore from '../store/character-at-world-store';

export const handleLocationSiteServiceConnection = (
  socket: Socket,
  gameNamespace: Namespace
) => {
  const isLocationSiteService =
    socket.handshake.auth.locationSiteServiceSecret ===
    process.env.NOG_LOCATION_SITE_SERVICE_SECRET;

  if (!isLocationSiteService) {
    return;
  }

  socket.emit(NogEvent.CONNECTED);
  logger.info('Location Site service connected');
  setLocationSiteSocket(socket);

  socket.on(
    'enter-building-commit',
    handleEnterBuildingCommit(gameNamespace)
  );

  socket.on(
    NogEvent.INIT_LOCATION_SITE_PAGE,
    handleInitLocationSitePageInternal(socket, gameNamespace)
  );
};

export const handleInitLocationSitePageInternal =
  (socket: Socket, gameNamespace: Namespace) =>
  ({ characterId, building }: { characterId: string; building: any }) => {
    const characterSocket = gameNamespace.to(characterId);
    characterSocket.emit(NogEvent.INIT_LOCATION_SITE_PAGE, building);
    logger.info({ characterId }, 'Sent "init-location-site-page-commit"');
  };

export const handleEnterBuilding =
  (socket: Socket) => (coordinates: Coordinates) => {
    const locationSiteSocket = getLocationSiteSocket();
    const characterId = socket.data.characterId;

    if (!characterId) {
      throw new Error('Character ID is missing');
    }

    logger.info({ characterId, coordinates }, 'Enter building');

    if (!locationSiteSocket) {
      logger.error(
        { characterId, coordinates },
        'Enter building failed. Location site socket missing.'
      );
      return;
    }

    locationSiteSocket.emit('enter-building', {
      characterId,
      coordinates
    });
  };

export const handleInitLocationSitePage = (socket: Socket) => () => {
  const locationSiteSocket = getLocationSiteSocket();
  const characterId = socket.data.characterId;
  const character = characterStore.get(characterId);

  if (!locationSiteSocket) {
    return;
  }

  locationSiteSocket.emit(NogEvent.INIT_LOCATION_SITE_PAGE, {
    characterId,
    buildingId: character.buildingId
  });
};

export const handleExitLocationSite = (socket: Socket) => () => {
  logger.debug('Exit location site');
  const characterId = socket.data.characterId;
  const character = characterStore.get(characterId);
  characterStore.set(characterId, {
    ...character,
    buildingId: null
  });
  socket.emit(NogEvent.REDIRECT, { page: NogPage.WORLD });
};

export const handleEnterBuildingCommit =
  (gameNamespace: Namespace) =>
  ({
    characterId,
    buildingId
  }: {
    characterId: string;
    buildingId: number;
  }) => {
    const character = characterStore.get(characterId);

    characterStore.set(characterId, {
      ...character,
      buildingId
    });

    characterAtWorldStore.delete(character.characterId);

    gameNamespace.to(characterId).emit(NogEvent.REDIRECT, {
      page: NogPage.LOCATION_SITE
    });

    logger.info('Sent redirect to location-site');
  };
