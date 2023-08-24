import { HexagonalMap } from './hexagonal-map';

export interface Indoor extends HexagonalMap {
  readonly buildingId: string;
  readonly floorNumber: number;
}
