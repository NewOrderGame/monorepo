import { Namespace, Socket } from 'socket.io';
import logger from './utils/logger';
import { Coordinates } from '@newordergame/common';
import {
  computeDestinationPoint,
  getDistance,
  getGreatCircleBearing,
  isPointInPolygon
} from 'geolib';
import axios from 'axios';

const OVERPASS_API_URL = 'https://overpass.hochburg.devlysh.com';
const OVERPASS_API_INTERPRETER_PATH = '/api/interpreter';

const SIGHT_RANGE = 24;

const OVERPASS_API_BUILDINGS_SKELS_QUERY = `
  [bbox][out:json];
  (
    way["building"];
  );
  
  out skel geom;
`;

type OverpassElement = { type: string; id: number };

type WayOverpassElement = {
  bounds: any;
  nodes: number[];
  geometry: { lat: number; lon: number }[];
} & OverpassElement;

type PlainBuilding = {
  x: number;
  y: number;
}[];

export const handleEnterBuilding =
  (socket: Socket, gameNamespace: Namespace) =>
  async (coordinates: Coordinates) => {
    try {
      const buildingsInSight = await getBuildingsInSight(
        coordinates,
        SIGHT_RANGE
      );
      const elements = buildingsInSight?.elements;

      const building: WayOverpassElement = determineBuilding(
        coordinates,
        elements
      );

      if (building) {
        const plainBuilding = convertToPlainBuilding(building);

        socket.emit('enter-building', plainBuilding);
        logger.trace('sent enter-building', plainBuilding);
      }
    } catch (error) {
      logger.error({ error, coordinates, sightRange: SIGHT_RANGE });
    }
  };

export const convertToPlainBuilding = (
  building: WayOverpassElement
): PlainBuilding => {
  const longestWallNodeIndex = determineLongestWallIndex(building);
  const longestWallNode = building.geometry[longestWallNodeIndex];

  const longestWallBearing = getGreatCircleBearing(
    building.geometry[longestWallNodeIndex],
    building.geometry[longestWallNodeIndex + 1]
  );

  return building.geometry.map((node) => {
    const distance = getDistance(longestWallNode, node);
    const bearing = getGreatCircleBearing(longestWallNode, node);
    const bearingDelta = bearing - longestWallBearing;

    return {
      x: distance * Math.cos((bearingDelta * Math.PI) / 180),
      y: distance * Math.sin((bearingDelta * Math.PI) / 180)
    };
  });
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
  buiding: WayOverpassElement
): number => {
  const geometry = buiding.geometry.slice(0, buiding.geometry.length - 1);
  const distances = geometry.map((node, index) => {
    const next = index === geometry.length - 1 ? 0 : index + 1;
    return getDistance(node, geometry[next], 1);
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
