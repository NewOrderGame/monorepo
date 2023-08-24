import { HexMap } from './hex-map';
import { GeoCoordinates } from './types';

export interface Outdoor extends HexMap {
  readonly terrainType: string;
  readonly boundaries: [GeoCoordinates, GeoCoordinates];
}
