import { Hexagonal } from './hexagonal';
import { cubicHexSchema, hexXSchema, hexYSchema, hexZSchema } from './schemas';
import { AxialHex, CubicHex } from './types';
import cleanNegativeZero from './utils/clean-negative-zero';

export class Hexagon implements Hexagonal {
  protected readonly x: number;
  protected readonly y: number;
  protected readonly z: number;

  constructor(x: number, y: number, z?: number) {
    if (isNaN(x) || isNaN(y) || (isNaN(z!) && z !== undefined)) {
      throw new Error('NaN is present');
    }

    hexXSchema.validateSync(x);
    hexYSchema.validateSync(y);
    hexZSchema.validateSync(z);

    if (typeof z === 'number') {
      cubicHexSchema.validateSync({ x, y, z });

      this.x = cleanNegativeZero(x);
      this.y = cleanNegativeZero(y);
      this.z = cleanNegativeZero(z);
    } else {
      this.x = cleanNegativeZero(x);
      this.y = cleanNegativeZero(-y);
      this.z = cleanNegativeZero(-x + y);
    }
  }

  static fromCubic(cubic: CubicHex): Hexagon {
    return new Hexagon(cubic.x, cubic.y, cubic.z);
  }

  static fromAxial(axial: AxialHex): Hexagon {
    const z = -axial.x + axial.y;
    return new Hexagon(
      cleanNegativeZero(axial.x),
      cleanNegativeZero(-axial.y),
      cleanNegativeZero(z)
    );
  }

  toCubic(): CubicHex {
    return {
      x: this.x,
      y: this.y,
      z: this.z
    };
  }

  toAxial(): AxialHex {
    return {
      x: this.x,
      y: cleanNegativeZero(-this.y)
    };
  }
}
