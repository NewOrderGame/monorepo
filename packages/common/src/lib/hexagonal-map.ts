import { Cell } from './cell';

export interface HexagonalMap {
  readonly id: string;
  readonly map: Cell[][];
  readonly maxX: number;
  readonly maxY: number;
}
