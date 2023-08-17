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
