import { AxialHex } from './axial-hex';
import { hexXSchema, hexYSchema, hexZSchema } from './schemas';
import logger from './utils/logger';

export class CubicHex {
  readonly x: number;
  readonly y: number;
  readonly z: number;

  public constructor(x: number, y: number, z?: number) {
    try {
      hexXSchema.validateSync(x);
      hexYSchema.validateSync(y);
      hexZSchema.validateSync(z);
    } catch (error) {
      logger.error(error, 'CubicHex coordinates are invalid');
      return;
    }

    if (x && y && z) {
      this.x = x;
      this.y = y;
      this.z = z;
    } else if (x && y) {
      this.x = x - y;
      this.y = -x;
      this.z = y;
    }
  }

  public toAxial(): AxialHex {
    return new AxialHex(this.x, this.y);
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
