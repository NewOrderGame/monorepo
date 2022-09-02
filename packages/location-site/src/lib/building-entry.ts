import logger from './utils/logger';
import { Coordinates } from '@newordergame/common';
import {
  computeDestinationPoint,
  getDistance,
  getGreatCircleBearing,
  isPointInPolygon
} from 'geolib';
import axios from 'axios';
import { Building } from './building';
import { Socket } from 'socket.io-client';
import {
  OVERPASS_API_BUILDINGS_SKELS_QUERY,
  OVERPASS_API_INTERPRETER_PATH,
  OVERPASS_API_URL,
  SIGHT_RANGE
} from './constants';
import { PlainBuildingNode, WayOverpassElement } from './types';

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

      const wayBuilding: WayOverpassElement = determineBuilding(
        coordinates,
        elements
      );

      if (wayBuilding) {
        const plainBuildingNodes: PlainBuildingNode[] =
          convertWayToPlainBuildingNodes(wayBuilding);

        const building = new Building(plainBuildingNodes);

        socket.emit('enter-building-commit', {
          characterId,
          map: building.getMap()
        });
        logger.trace('Sent "enter-building-commit" event', {
          characterId,
          map: building.getMap()
        });
      }
    } catch (error) {
      logger.error({ error, coordinates, sightRange: SIGHT_RANGE });
    }
  };

export const convertWayToPlainBuildingNodes = (
  building: WayOverpassElement
): PlainBuildingNode[] => {
  const longestWallNodeIndex = determineLongestWallIndex(building);
  const longestWallNode = building.geometry[longestWallNodeIndex];

  const longestWallBearing = getGreatCircleBearing(
    building.geometry[longestWallNodeIndex],
    building.geometry[longestWallNodeIndex + 1]
  );

  const rawPlainBuilding = building.geometry.map((node) => {
    const distance = getDistance(longestWallNode, node);
    const bearing = getGreatCircleBearing(longestWallNode, node);
    const bearingDelta = bearing - longestWallBearing;

    return {
      x: Math.round(distance * Math.cos((bearingDelta * Math.PI) / 180)),
      y: Math.round(distance * Math.sin((bearingDelta * Math.PI) / 180))
    };
  });

  const minX = Math.min(...rawPlainBuilding.map((node) => node.x));
  const minY = Math.min(...rawPlainBuilding.map((node) => node.y));

  return rawPlainBuilding.map((node) => ({
    x: node.x + Math.abs(minX),
    y: node.y + Math.abs(minY)
  }));
};

export const determineBuilding = (
  coordinates: Coordinates,
  elements: WayOverpassElement[]
) => {
  return elements.find((way: WayOverpassElement) => {
    return isPointInPolygon(coordinates, way.geometry);
  });
};

export const determineLongestWallIndex = (
  building: WayOverpassElement
): number => {
  const geometry = building.geometry.slice(0, building.geometry.length - 1);
  const distances = geometry.map((node, index) => {
    const next = index === geometry.length - 1 ? 0 : index + 1;
    return getDistance(node, geometry[next], 0.01);
  });
  return distances.indexOf(Math.max(...distances));
};

export const getBuildingsInSight = (
  coordinates: Coordinates,
  sightRange: number
) => {
  const min = computeDestinationPoint(
    coordinates,
    sightRange * 2,
    225 // bottom left
  );
  const max = computeDestinationPoint(
    coordinates,
    sightRange * 2,
    45 // top right
  );

  if (!min.longitude || !min.latitude || !max.longitude || !max.latitude) {
    throw new Error('Error during getting min and max boundary points');
  }

  const uri = `${OVERPASS_API_URL}${OVERPASS_API_INTERPRETER_PATH}?data=${OVERPASS_API_BUILDINGS_SKELS_QUERY}&bbox=${min.longitude},${min.latitude},${max.longitude},${max.latitude}`;

  return axios.get(uri).then((response) => response.data);
};
