import { abs, max, round } from 'mathjs';
import { AxialHex, CubicHex, HexDirection } from './types';
import { Hexagonal } from './hexagonal';
import cleanNegativeZero from './utils/clean-negative-zero';
import { cubicHexSchema, hexXSchema, hexYSchema, hexZSchema } from './schemas';
import { HexDirectionNumeric } from './enums';
import { BoolHexMapLayer, BoolHexMapLayerName } from './hex-map';

export class Hexagon implements Hexagonal {
  readonly x: number;
  readonly y: number;
  readonly z: number;

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

  // static constructor method
  static fromCubic(cubic: CubicHex): Hexagon {
    return new Hexagon(cubic.x, cubic.y, cubic.z);
  }

  // static constructor method
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

  // VECTORS

  static vectors: Record<HexDirection, Hexagon> = {
    [HexDirectionNumeric.N0]: new Hexagon(-1, 1, 0),
    [HexDirectionNumeric.N1]: new Hexagon(0, 1, -1),
    [HexDirectionNumeric.N2]: new Hexagon(1, 0, -1),
    [HexDirectionNumeric.N3]: new Hexagon(1, -1, 0),
    [HexDirectionNumeric.N4]: new Hexagon(0, -1, 1),
    [HexDirectionNumeric.N5]: new Hexagon(-1, 0, 1)
  };

  static DIRECTIONS_QUANTITY: number = 6;

  static getVector(direction: HexDirection): Hexagon {
    return this.vectors[direction];
  }

  // STATIC METHODS

  static cubicEqual(hexA: CubicHex, hexB: CubicHex): boolean {
    return hexA.x === hexB.x && hexA.y === hexB.y && hexA.z === hexB.z;
  }

  static axialEqual(hexA: AxialHex, hexB: AxialHex): boolean {
    return hexA.x === hexB.x && hexA.y === hexB.y;
  }

  static cubicToAxial(cubic: CubicHex): AxialHex {
    return { x: cubic.x, y: cleanNegativeZero(-cubic.y) };
  }

  static axialToCubic(axial: AxialHex): CubicHex {
    const x = cleanNegativeZero(axial.x);
    const y = cleanNegativeZero(-axial.y);
    const z = cleanNegativeZero(-axial.x + axial.y);
    return { x: x, y: y, z: z };
  }

  static cubicDistance(hexA: CubicHex, hexB: CubicHex): number {
    const dX = abs(hexA.x - hexB.x);
    const dY = abs(hexA.y - hexB.y);
    const dZ = abs(hexA.z - hexB.z);
    return max(dX, dY, dZ);
  }

  static axialDistance(axialA: AxialHex, axialB: AxialHex): number {
    const dx = axialA.x - axialB.x;
    const dy = axialB.y - axialA.y;
    return (abs(dx) + abs(dy) + abs(-dx + dy)) / 2;
  }

  static cubicAdd(hexA: CubicHex, hexB: CubicHex): CubicHex {
    return {
      x: hexA.x + hexB.x,
      y: hexA.y + hexB.y,
      z: hexA.z + hexB.z
    };
  }

  static axialAdd(hexA: AxialHex, hexB: AxialHex): AxialHex {
    return {
      x: hexA.x + hexB.x,
      y: hexA.y + hexB.y
    };
  }

  static cubicScale(hex: CubicHex, factor: number): CubicHex {
    return {
      x: cleanNegativeZero(hex.x * factor),
      y: cleanNegativeZero(hex.y * factor),
      z: cleanNegativeZero(hex.z * factor)
    };
  }

  static axialScale(hex: AxialHex, factor: number): AxialHex {
    return {
      x: cleanNegativeZero(hex.x * factor),
      y: cleanNegativeZero(hex.y * factor)
    };
  }

  static lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
  }

  static cubicLerp(hexA: CubicHex, hexB: CubicHex, t: number): CubicHex {
    const x = this.lerp(hexA.x, hexB.x, t);
    const y = this.lerp(hexA.y, hexB.y, t);
    const z = this.lerp(hexA.z, hexB.z, t);
    return { x, y, z };
  }

  static cubicDrawLine(hexA: CubicHex, hexB: CubicHex): CubicHex[] {
    const distance = this.cubicDistance(hexA, hexB);

    if (distance === 0) {
      return [hexA];
    }

    const line: CubicHex[] = [];
    for (let i = 0; i <= distance; i++) {
      const t = i / distance;
      const interpolated = this.cubicLerp(hexA, hexB, t);
      const rounded = this.cubicRound(interpolated);

      line.push(new Hexagon(rounded.x, rounded.y, rounded.z).toCubic());
    }
    return line;
  }

  static axialDrawLine(hexA: AxialHex, hexB: AxialHex): AxialHex[] {
    const cubicA = this.axialToCubic(hexA);
    const cubicB = this.axialToCubic(hexB);
    return this.cubicDrawLine(cubicA, cubicB).map((hex) =>
      this.cubicToAxial(hex)
    );
  }

  static cubicRound(hex: CubicHex): CubicHex {
    let x = round(hex.x);
    let y = round(hex.y);
    let z = round(hex.z);

    const dX = abs(x - hex.x);
    const dY = abs(y - hex.y);
    const dZ = abs(z - hex.z);

    if (dX > dY && dX > dZ) {
      x = -y - z;
    } else if (dY > dZ) {
      y = -x - z;
    } else {
      z = -x - y;
    }
    return {
      x: cleanNegativeZero(x),
      y: cleanNegativeZero(y),
      z: cleanNegativeZero(z)
    };
  }

  static axialRound(hex: AxialHex): AxialHex {
    return this.cubicToAxial(this.cubicRound(this.axialToCubic(hex)));
  }

  static cubicDirection(direction: HexDirection): CubicHex {
    return this.getVector(direction).toCubic();
  }

  static axialDirection(direction: HexDirection): AxialHex {
    return this.getVector(direction).toAxial();
  }

  static cubicNeighbor(cube: CubicHex, direction: HexDirection): CubicHex {
    return this.cubicAdd(cube, this.cubicDirection(direction));
  }

  static axialNeighbor(hex: AxialHex, direction: number): AxialHex {
    return this.axialAdd(hex, this.axialDirection(direction));
  }

  static cubicRange(center: CubicHex, N: number): CubicHex[] {
    const results: CubicHex[] = [];
    for (let q = -N; q <= N; q++) {
      for (let r = Math.max(-N, -q - N); r <= Math.min(N, -q + N); r++) {
        const s = -q - r;
        results.push(this.cubicAdd(center, { x: q, y: r, z: s }));
      }
    }
    return results;
  }

  static axialRange(center: AxialHex, N: number): AxialHex[] {
    const results: AxialHex[] = [];
    for (let q = -N; q <= N; q++) {
      for (let r = Math.max(-N, -q - N); r <= Math.min(N, -q + N); r++) {
        results.push(this.axialAdd(center, { x: q, y: r }));
      }
    }
    return results;
  }

  static cubicRangeIntersection(
    rangeA: CubicHex[],
    rangeB: CubicHex[]
  ): CubicHex[] {
    return rangeA.filter((hex1) =>
      rangeB.some((hex2) => Hexagon.cubicEqual(hex1, hex2))
    );
  }

  static axialRangeIntersection(
    rangeA: AxialHex[],
    rangeB: AxialHex[]
  ): AxialHex[] {
    return rangeA.filter((hexA) =>
      rangeB.some((hexB) => Hexagon.axialEqual(hexA, hexB))
    );
  }

  static cubicRing(center: CubicHex, radius: number): CubicHex[] {
    if (radius < 0) {
      throw new Error('Radius sould be greater than zero');
    }
    const results: CubicHex[] = [];
    if (radius === 0) {
      results.push(center);
      return results;
    }

    let hex = Hexagon.cubicAdd(
      center,
      this.cubicScale(
        Hexagon.cubicDirection(HexDirectionNumeric.N4 as HexDirection),
        radius
      )
    );
    for (let i = 0; i < Hexagon.DIRECTIONS_QUANTITY; i++) {
      for (let j = 0; j < radius; j++) {
        results.push(hex);
        hex = Hexagon.cubicNeighbor(hex, i as HexDirection);
      }
    }
    return results;
  }

  static cubicSpiral(center: CubicHex, radius: number): CubicHex[] {
    if (radius < 0) {
      throw new Error('Radius sould be greater than zero');
    }
    let results: CubicHex[] = [center];
    for (let k = 1; k <= radius; k++) {
      results = results.concat(this.cubicRing(center, k));
    }
    return results;
  }

  static axialRing(center: AxialHex, radius: number): AxialHex[] {
    const cubicCenter = Hexagon.axialToCubic(center);
    const cubicRing = this.cubicRing(cubicCenter, radius);
    return cubicRing.map(Hexagon.cubicToAxial);
  }

  static axialSpiral(center: AxialHex, N: number): AxialHex[] {
    const cubicCenter = Hexagon.axialToCubic(center);
    const cubicSpiral = this.cubicSpiral(cubicCenter, N);
    return cubicSpiral.map(Hexagon.cubicToAxial);
  }

  // TODO: Complex methods. This methods require decomposition:
  /* begin */

  static collectExteriorWallsBoolHexMap(
    plainBuildingNodes: AxialHex[]
  ): BoolHexMapLayer {
    const wallMap: BoolHexMapLayer = [];

    for (let i = 0; i < plainBuildingNodes.length - 1; i++) {
      const current = plainBuildingNodes[i];
      const next = plainBuildingNodes[i + 1];

      const line = this.axialDrawLine(current, next);

      for (const hex of line) {
        if (!wallMap[hex.x]) {
          wallMap[hex.x] = [];
        }
        wallMap[hex.x][hex.y] = true;
      }
    }
    return wallMap;
  }

  static collectInteriorBoolHexMap(
    max: AxialHex,
    axialBuilding: AxialHex[],
    {
      exteriorWallsBoolHexMapLayer
    }: Record<BoolHexMapLayerName.EXTERIOR_WALLS, BoolHexMapLayer>
  ): BoolHexMapLayer {
    const interiorHexagonsMap: BoolHexMapLayer = [];

    for (let x = 0; x <= max.x; x++) {
      interiorHexagonsMap[x] = [];

      for (let y = 0; y <= max.y; y++) {
        const isWall = exteriorWallsBoolHexMapLayer[x]?.[y] ?? false;

        const isInterior =
          !isWall && this.isHexInsidePolygon({ x, y }, axialBuilding);

        interiorHexagonsMap[x][y] = isWall || isInterior;
      }
    }

    return interiorHexagonsMap;
  }

  static isHexInsidePolygon(
    hex: AxialHex,

    plainBuildingNodes: AxialHex[]
  ): boolean {
    let inside = false;

    for (
      let i = 0, j = plainBuildingNodes.length - 1;
      i < plainBuildingNodes.length;
      j = i++
    ) {
      const xi = plainBuildingNodes[i].x;
      const yi = plainBuildingNodes[i].y;
      const xj = plainBuildingNodes[j].x;
      const yj = plainBuildingNodes[j].y;

      const isAboveStart = yi > hex.y;
      const isAboveEnd = yj > hex.y;
      const isCrossingHorizontal = isAboveStart !== isAboveEnd;

      const intersectionX = ((xj - xi) * (hex.y - yi)) / (yj - yi) + xi;
      const isToLeftOfPoint = hex.x < intersectionX;

      const intersect = isCrossingHorizontal && isToLeftOfPoint;

      if (intersect) {
        inside = !inside;
      }
    }

    return inside;
  }

  /* end */
}
