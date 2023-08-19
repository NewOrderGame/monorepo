import { AxialHex, CubicHex } from './types';

export interface Hexagonal {
  toCubic: () => CubicHex;
  toAxial: () => AxialHex;
}
