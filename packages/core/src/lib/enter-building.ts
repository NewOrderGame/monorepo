import { Namespace, Socket } from 'socket.io';
import {
  IndoorHexMap,
  GeoCoordinates,
  NogEvent,
  NogPage,
  logger
} from '@newordergame/common';
import {
  getEncounterSocket,
  setEncounterSocket
} from './store/encounter-socket-store';
import characterStore from './store/character-store';
import characterAtWorldStore from './store/character-at-world-store';

export const handleEncounterServiceConnection = (
  encounterSocket: Socket,
  gameNamespace: Namespace
) => {
  const isLocationSiteBuilderService =
    encounterSocket.handshake.auth.encounterServiceSecret ===
    process.env.NOG_ENCOUNTER_SERVICE_SECRET;

  if (!isLocationSiteBuilderService) {
    return;
  }

  encounterSocket.emit(NogEvent.CONNECTED);
  logger.info('Location Site service connected');
  setEncounterSocket(encounterSocket);

  encounterSocket.on(
    NogEvent.ENTER_BUILDING_COMMIT,
    handleEnterBuildingCommit(gameNamespace)
  );

  encounterSocket.on(
    NogEvent.INIT_LOCATION_SITE_PAGE,
    handleInitLocationSitePage(gameNamespace)
  );
};

export const handleInitLocationSitePage =
  (gameNamespace: Namespace) =>
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
    const encounterSocket = getEncounterSocket();
    const characterId = socket.data.characterId;

    if (!characterId) {
      logger.error('Character ID is missing');
      return;
    }

    if (!encounterSocket) {
      logger.error(
        { characterId, coordinates },
        'Enter building failed. Encounter socket missing.'
      );
      return;
    }

    encounterSocket.emit(NogEvent.ENTER_BUILDING, {
      characterId,
      coordinates
    });
  };

export const handleEncounterServiceInitLocationSitePage =
  (socket: Socket) => () => {
    const encounterSocket = getEncounterSocket();
    const characterId = socket.data.characterId;
    const character = characterStore.get(characterId);

    if (!character) {
      logger.error('Character not found');
      return;
    }

    if (!encounterSocket) {
      return;
    }

    encounterSocket.emit(NogEvent.INIT_LOCATION_SITE_PAGE, {
      characterId,
      buildingId: character.buildingId
    });
  };

export const handleExitBuilding = (socket: Socket) => () => {
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
