import { Cell } from './cell';

export interface Building {
  readonly map: Cell[][];
  readonly maxX: number;
  readonly maxY: number;
  printMap(): void;
}
