import { Namespace, Socket } from 'socket.io';
import logger from './utils/logger';
import { Coordinates } from '@newordergame/common';
import { computeDestinationPoint, getDistance, isPointInPolygon } from 'geolib';
import axios from 'axios';

const OVERPASS_API_URL = 'https://overpass.hochburg.devlysh.com';
const OVERPASS_API_INTERPRETER_PATH = '/api/interpreter';

const OVERPASS_API_BUILDINGS_SKELS_QUERY = `
  [bbox][out:json];
  (
    node;
    way["building"];
  );
  
  out skel geom;
`;

type OverpassElement = { type: string; id: number };
type NodeOverpassElement = { lat: number; lon: number } & OverpassElement;
type WayOverpassElement = {
  bounds: any;
  nodes: number[];
  geometry: any[];
} & OverpassElement;

export const handleEnterBuilding =
  (socket: Socket, gameNamespace: Namespace) =>
  async (coordinates: Coordinates) => {
    const sightRange = 30;
    let buildings;
    try {
      buildings = await getBuildingsInSight(coordinates, sightRange);

      const nodes = buildings?.elements.filter(
        (element: OverpassElement) => element.type === 'node'
      );

      const ways = buildings?.elements.filter(
        (element: OverpassElement) => element.type === 'way'
      );

      const closestNode: NodeOverpassElement = nodes.reduce(
        (accumulator: number[], node: NodeOverpassElement, index: number) => {
          accumulator[index] = getDistance(coordinates, node, 0.1);

          if (index === nodes.length - 1) {
            const min = Math.min(...accumulator);
            const indexOfMin = accumulator.indexOf(min);
            return nodes[indexOfMin];
          }

          return accumulator;
        },
        []
      );

      const closestWays = ways.filter((way: WayOverpassElement) => {
        return way.nodes.includes(closestNode.id);
      });

      let contains = false;
      closestWays.forEach((way: WayOverpassElement) => {
        contains = contains || isPointInPolygon(coordinates, way.geometry);
      });
      logger.debug({ contains }, 'CONTAINS');
    } catch (error) {
      logger.error({ error, coordinates, sightRange });
    }
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
