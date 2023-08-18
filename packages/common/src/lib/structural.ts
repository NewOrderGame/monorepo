import { Cell } from './cell';

export interface Structural {
  readonly map: Cell[][];
  readonly maxX: number;
  readonly maxY: number;
}
