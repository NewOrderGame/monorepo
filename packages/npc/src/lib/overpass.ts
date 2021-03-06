import { Coordinates } from '@newordergame/common';
import logger from './utils/logger';
import { computeDestinationPoint, getCenter } from 'geolib';
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

export const getBuildingsInSight = (
  coordinates: Coordinates,
  sightRange: number
) => {
  const min = computeDestinationPoint(
    coordinates,
    sightRange / 2,
    225 // bottom left
  );
  const max = computeDestinationPoint(
    coordinates,
    sightRange / 2,
    45 // top right
  );

  const uri = `${OVERPASS_API_URL}${OVERPASS_API_INTERPRETER_PATH}?data=${OVERPASS_API_BUILDINGS_SKELS_QUERY}&bbox=${min.longitude},${min.latitude},${max.longitude},${max.latitude}`;

  return axios
    .get(uri.replace(/[\s\n]+/g, ' '))
    .then((response) => response.data);
};

export const getRandomHouseEntryCoordinates = async (
  coordinates: Coordinates,
  range: number
): Promise<Coordinates> => {
  const data = await getBuildingsInSight(coordinates, range);

  const ways = data.elements.filter(
    (element: OverpassElement) => element.type === 'way'
  );

  const way = ways[Math.floor(Math.random() * ways.length)];
  const index = Math.floor(Math.random() * way.geometry.length);
  const nodes: { lat: number; lon: number }[] = [];
  nodes.push(way.geometry[index]);
  nodes.push(
    index === way.geometry.length - 1
      ? way.geometry[1]
      : way.geometry[index + 1]
  );

  const center = getCenter(nodes);

  if (!center) {
    logger.error(
      { center, coordinates, sightRange: range },
      'Could not find center'
    );
    return;
  }

  return {
    lat: center.latitude,
    lng: center.longitude
  };
};
