import { GeoCoordinates } from './types';

export const DEFAULT_COORDINATES: GeoCoordinates = {
  lat: 46.48529995180195,
  lng: 30.74057757854462
};

export const EPSILON = 1e-6;

export const OVERPASS_API_URL = 'https://overpass.hochburg.devlysh.com';
export const OVERPASS_API_INTERPRETER_PATH = '/api/interpreter';

export const SIGHT_RANGE = 24;

export const OVERPASS_API_BUILDINGS_SKELS_QUERY = `
  [bbox][out:json];
  (
    way["building"];
  );
  
  out skel geom;
`;
