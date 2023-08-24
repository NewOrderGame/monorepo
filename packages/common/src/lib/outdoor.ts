import { HexagonalMap } from './hexagonal-map';
import { GeoCoordinates } from './types';

export interface Outdoor extends HexagonalMap {
  readonly terrainType: string;
  readonly boundaries: [GeoCoordinates, GeoCoordinates];
}
