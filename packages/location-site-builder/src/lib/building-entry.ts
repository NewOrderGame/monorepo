import {
  IndoorHexMap,
  GeoCoordinates,
  AxialHex,
  NogEvent,
  Utils,
  WayOverpassElement,
  logger
} from '@newordergame/common';
import { Socket } from 'socket.io-client';
import buildingStore from '../store/indoor-hex-map-store';
import { SIGHT_RANGE } from '@newordergame/common';
import { nanoid } from 'nanoid';

export const handleEnterBuilding =
  (socket: Socket) =>
  async ({
    characterId,
    coordinates
  }: {
    characterId: string;
    coordinates: GeoCoordinates;
  }) => {
    try {
      const buildingsInSight = await Utils.Overpass.getBuildingsInSight(
        coordinates,
        SIGHT_RANGE
      );
      const elements = buildingsInSight?.elements;

      const wayBuilding: WayOverpassElement | null =
        Utils.Overpass.determineBuilding(coordinates, elements);

      if (wayBuilding) {
        const buildingId = wayBuilding.id;
        let building: IndoorHexMap | undefined = buildingStore.get(buildingId);
        if (!building) {
          const axialHexList: AxialHex[] =
            Utils.Overpass.convertWayToPlainBuildingNodes(wayBuilding);
          building = new IndoorHexMap(
            nanoid(),
            buildingId.toString(),
            1,
            axialHexList
          );
          buildingStore.set(buildingId, building);
          logger.info({ buildingId }, 'Created new building');
        }

        socket.emit(NogEvent.ENTER_BUILDING_COMMIT, {
          characterId,
          buildingId
        });
      }
    } catch (error) {
      logger.error({ error, coordinates, sightRange: SIGHT_RANGE });
    }
  };

export const handleInitLocationSitePage =
  (socket: Socket) =>
  ({
    characterId,
    buildingId
  }: {
    characterId: string;
    buildingId: number;
  }) => {
    const building = buildingStore.get(buildingId);
    socket.emit(NogEvent.INIT_LOCATION_SITE_PAGE, {
      characterId,
      building
    });
    logger.info(
      { characterId, buildingId },
      'Sent "init-location-site-page" event'
    );
  };
