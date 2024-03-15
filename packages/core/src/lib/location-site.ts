import { Namespace, Socket } from 'socket.io';
import {
  IndoorHexMap,
  GeoCoordinates,
  NogEvent,
  NogPage,
  logger
} from '@newordergame/common';
import {
  getLocationSiteBuilderSocket,
  setLocationSiteBuilderSocket
} from './store/encounter-socket-store';
import characterStore from './store/character-store';
import characterAtWorldStore from './store/character-at-world-store';

export const handleLocationSiteBuilderServiceConnection = (
  locationSiteBuilderSocket: Socket,
  gameNamespace: Namespace
) => {
  const isLocationSiteBuilderService =
    locationSiteBuilderSocket.handshake.auth
      .locationSiteBuilderServiceSecret ===
    process.env.NOG_LOCATION_SITE_BUILDER_SERVICE_SECRET;

  if (!isLocationSiteBuilderService) {
    return;
  }

  locationSiteBuilderSocket.emit(NogEvent.CONNECTED);
  logger.info('Location Site service connected');
  setLocationSiteBuilderSocket(locationSiteBuilderSocket);

  locationSiteBuilderSocket.on(
    NogEvent.ENTER_BUILDING_COMMIT,
    handleEnterBuildingCommit(gameNamespace)
  );

  locationSiteBuilderSocket.on(
    NogEvent.INIT_LOCATION_SITE_PAGE,
    handleInitLocationSitePageInternal(locationSiteBuilderSocket, gameNamespace)
  );
};

export const handleInitLocationSitePageInternal =
  (socket: Socket, gameNamespace: Namespace) =>
  ({
    characterId,
    building
  }: {
    characterId: string;
    building: IndoorHexMap;
  }) => {
    const characterSocket = gameNamespace.to(characterId);
    characterSocket.emit(NogEvent.INIT_LOCATION_SITE_PAGE, building);
    logger.info({ characterId }, 'Sent "init-location-site-page-commit"');
  };

export const handleEnterBuilding =
  (socket: Socket) => (coordinates: GeoCoordinates) => {
    const locationSiteBuilderSocket = getLocationSiteBuilderSocket();
    const characterId = socket.data.characterId;

    if (!characterId) {
      logger.error('Character ID is missing');
      return;
    }

    if (!locationSiteBuilderSocket) {
      logger.error(
        { characterId, coordinates },
        'Enter building failed. Location site socket missing.'
      );
      return;
    }

    locationSiteBuilderSocket.emit(NogEvent.ENTER_BUILDING, {
      characterId,
      coordinates
    });
  };

export const handleInitLocationSitePage = (socket: Socket) => () => {
  const locationSiteBuilderSocket = getLocationSiteBuilderSocket();
  const characterId = socket.data.characterId;
  const character = characterStore.get(characterId);

  if (!character) {
    logger.error('Character not found');
    return;
  }

  if (!locationSiteBuilderSocket) {
    return;
  }

  locationSiteBuilderSocket.emit(NogEvent.INIT_LOCATION_SITE_PAGE, {
    characterId,
    buildingId: character.buildingId
  });
};

export const handleExitLocationSite = (socket: Socket) => () => {
  const characterId = socket.data.characterId;
  const character = characterStore.get(characterId);

  if (!character) {
    logger.error('Character not found');
    return;
  }

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

    if (!character) {
      logger.error('Character not found');
      return;
    }

    characterStore.set(characterId, {
      ...character,
      buildingId
    });

    characterAtWorldStore.delete(character.characterId);

    gameNamespace.to(characterId).emit(NogEvent.REDIRECT, {
      page: NogPage.LOCATION_SITE
    });

    logger.info('Sent redirect to LOCATION_SITE');
  };
