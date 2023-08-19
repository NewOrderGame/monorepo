import { Hexagon2D } from './types';

export interface Hexagonal {
  readonly x: number;
  readonly y: number;
  readonly z?: number;

  to2D: () => Hexagon2D;
}
