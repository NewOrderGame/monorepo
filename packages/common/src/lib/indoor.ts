import { HexMap } from './hex-map';

export interface Indoor extends HexMap {
  readonly buildingId: string;
  readonly floorNumber: number;
}
