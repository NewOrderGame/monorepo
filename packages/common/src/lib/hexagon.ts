import { Hexagonal } from './hexagonal';
import { cubicHexSchema, hexXSchema, hexYSchema, hexZSchema } from './schemas';
import { AxialHex, CubicHex } from './types';
import { evaluate } from 'mathjs';

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

      this.x = evaluate(`${x}`);
      this.y = evaluate(`${y}`);
      this.z = evaluate(`${z}`);
    } else {
      this.x = evaluate(`${x}`);
      this.y = evaluate(`${-y}`);
      this.z = evaluate(`${y - x}`);
    }
  }

  static fromCubic(cubic: CubicHex): Hexagon {
    return new Hexagon(cubic.x, cubic.y, cubic.z);
  }

  static fromAxial(axial: AxialHex): Hexagon {
    const z = axial.y - axial.x;
    return new Hexagon(axial.x, -axial.y, z);
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
      y: -this.y
    };
  }
}
