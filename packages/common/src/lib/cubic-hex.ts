import { hexXSchema, hexYSchema, hexZSchema } from './schemas';
import { MapCoordinates } from './types';
import { evaluate } from 'mathjs';

export class CubicHex {
  private x: number;
  private y: number;
  private z: number;

  public constructor(x: number, y: number, z?: number) {
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

  public toMapCoordinates(): MapCoordinates {
    return {
      x: this.x,
      y: -this.y
    };
  }

  public getX(): number {
    return this.x;
  }

  public getY(): number {
    return this.y;
  }

  public getZ(): number {
    return this.z;
  }
}
