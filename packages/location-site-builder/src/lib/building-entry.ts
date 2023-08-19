import {
  Building,
  Coordinates,
  NogEvent,
  Hexagon2D,
  WayOverpassElement,
  logger,
  Utils
} from '@newordergame/common';
import axios from 'axios';
import { computeDestinationPoint } from 'geolib';
import { multiply } from 'mathjs';
import { Socket } from 'socket.io-client';
import buildingStore from '../store/building-store';
import {
  OVERPASS_API_BUILDINGS_SKELS_QUERY,
  OVERPASS_API_INTERPRETER_PATH,
  OVERPASS_API_URL,
  SIGHT_RANGE
} from './constants';

export const handleEnterBuilding =
  (socket: Socket) =>
  async ({
    characterId,
    coordinates
  }: {
    characterId: string;
    coordinates: Coordinates;
  }) => {
    try {
      const buildingsInSight = await getBuildingsInSight(
        coordinates,
        SIGHT_RANGE
      );
      const elements = buildingsInSight?.elements;

      const wayBuilding: WayOverpassElement | null =
        Utils.Overpass.determineBuilding(coordinates, elements);

      if (wayBuilding) {
        const buildingId = wayBuilding.id;
        let building: Building | undefined = buildingStore.get(buildingId);
        if (!building) {
          const hex2DList: Hexagon2D[] =
            Utils.Overpass.convertWayToPlainBuildingNodes(wayBuilding);
          building = new Building(buildingId, hex2DList);
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

export const getBuildingsInSight = (
  coordinates: Coordinates,
  sightRange: number
) => {
  const min = computeDestinationPoint(
    coordinates,
    multiply(sightRange, 2),
    225 // bottom left
  );
  const max = computeDestinationPoint(
    coordinates,
    multiply(sightRange, 2),
    45 // top right
  );

  if (!min.longitude || !min.latitude || !max.longitude || !max.latitude) {
    throw new Error('Error during getting min and max boundary points');
  }

  const uri = `${OVERPASS_API_URL}${OVERPASS_API_INTERPRETER_PATH}?data=${OVERPASS_API_BUILDINGS_SKELS_QUERY}&bbox=${min.longitude},${min.latitude},${max.longitude},${max.latitude}`;

  return axios.get(uri).then((response) => response.data);
};
