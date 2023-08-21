import { HexDirectionNumeric } from './enums';
import { Hexagon } from './hexagon';
import { HexDirection } from './types';

export class HexDirectionVectors {
  static vectors: Record<HexDirection, Hexagon> = {
    [HexDirectionNumeric.N0]: new Hexagon(-1, 1, 0),
    [HexDirectionNumeric.N1]: new Hexagon(0, 1, -1),
    [HexDirectionNumeric.N2]: new Hexagon(1, 0, -1),
    [HexDirectionNumeric.N3]: new Hexagon(1, -1, 0),
    [HexDirectionNumeric.N4]: new Hexagon(0, -1, 1),
    [HexDirectionNumeric.N5]: new Hexagon(-1, 0, 1)
  };

  static get(direction: HexDirection): Hexagon {
    return this.vectors[direction];
  }
}
