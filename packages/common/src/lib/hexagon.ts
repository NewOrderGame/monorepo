import { Hexagonal } from './hexagonal';
import { hexXSchema, hexYSchema, hexZSchema } from './schemas';
import { Hexagon2D } from './types';
import { evaluate } from 'mathjs';

export class Hexagon implements Hexagonal {
  constructor(
    readonly x: number,
    readonly y: number,
    readonly z?: number
  ) {
    hexXSchema.validateSync(x);
    hexYSchema.validateSync(y);
    hexZSchema.validateSync(z);

    if (typeof z === 'number') {
      this.x = evaluate(`${x}`);
      this.y = evaluate(`${y}`);
      this.z = evaluate(`${z}`);
    } else {
      this.x = evaluate(`${x}`);
      this.y = evaluate(`${-y}`);
      this.z = evaluate(`${y - x}`);
    }
  }

  to2D(): Hexagon2D {
    return {
      x: this.x,
      y: -this.y
    };
  }
}
