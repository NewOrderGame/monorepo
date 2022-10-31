import { AxialHex } from './axial-hex';
import { hexXSchema, hexYSchema, hexZSchema } from './schemas';

export class CubicHex {
  private x: number;
  private y: number;
  private z: number;

  public constructor(x: number, y: number, z?: number) {
    hexXSchema.validateSync(x);
    hexYSchema.validateSync(y);
    hexZSchema.validateSync(z);

    if (typeof z === 'number') {
      this.x = x;
      this.y = y;
      this.z = z;
    } else {
      this.x = x - y;
      this.y = -x;
      this.z = y;
    }
  }

  public toAxial(): AxialHex {
    return new AxialHex(this.x, this.y, this.z);
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
