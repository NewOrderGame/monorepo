import { Cell } from './cell';

export interface HexMap {
  readonly id: string;
  readonly map: Cell[][];
  readonly maxX: number;
  readonly maxY: number;
}
