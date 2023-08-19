import { Coordinates } from './types';

export const DEFAULT_COORDINATES: Coordinates = {
  lat: 46.47705630400258,
  lng: 30.730369681615272
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
