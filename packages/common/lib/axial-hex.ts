import { hexXSchema, hexYSchema, hexZSchema } from './schemas';
import logger from './utils/logger';
import { CubicHex } from './cubic-hex';

export class AxialHex {
  readonly x: number;
  readonly y: number;

  public constructor(x: number, y: number, z?: number) {
    try {
      hexXSchema.validateSync(x);
      hexYSchema.validateSync(y);
      hexZSchema.validateSync(z);
    } catch (error) {
      logger.error(error, 'AxialHex coordinates are invalid');
      return;
    }

    if (x && y && z) {
      this.x = -y;
      this.y = z;
    } else if (x && y) {
      this.x = x;
      this.y = y;
    }
  }

  public toCubic(): CubicHex {
    return new CubicHex(this.x, this.y);
  }

  public getX(): number {
    return this.x;
  }

  public getY(): number {
    return this.y;
  }
}
