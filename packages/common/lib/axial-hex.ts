import { hexXSchema, hexYSchema, hexZSchema } from './schemas';
import { CubicHex } from './cubic-hex';

export class AxialHex {
  private x: number;
  private y: number;

  public constructor(x: number, y: number, z?: number) {
    hexXSchema.validateSync(x);
    hexYSchema.validateSync(y);
    hexZSchema.validateSync(z);

    if (typeof z === 'number') {
      this.x = -y;
      this.y = z;
    } else {
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
