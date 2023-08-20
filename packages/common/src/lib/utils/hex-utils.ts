import { Hexagon } from '../hexagon';
import { abs, max, round } from 'mathjs';
import { AxialHex, CubicHex } from '../types';
import { Utils } from '../..';

export default class HexUtils {
  static cubicToAxial(cubic: CubicHex): AxialHex {
    return { x: cubic.x, y: cubic.z };
  }

  static axialToCubic(axial: AxialHex): CubicHex {
    const x = axial.x;
    const z = axial.y;
    const y = -x - z;
    return { x: x, y: y, z: z };
  }

  static calculateCubicDistance(hexA: Hexagon, hexB: Hexagon): number {
    const aCubic = hexA.toCubic();
    const bCubic = hexB.toCubic();
    const dX = abs(aCubic.x - bCubic.x);
    const dY = abs(aCubic.y - bCubic.y);
    const dZ = abs(aCubic.z - bCubic.z);
    return max(dX, dY, dZ);
  }

  static calculateAxialDistance(axialA: AxialHex, axialB: AxialHex): number {
    const dx = axialA.x - axialB.x;
    const dy = axialB.y - axialA.y;
    return (abs(dx) + abs(dy) + abs(-dx - dy)) / 2;
  }

  static lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
  }

  static cubicLerp(hexA: Hexagon, hexB: Hexagon, t: number): Hexagon {
    const aCubic = hexA.toCubic();
    const bCubic = hexB.toCubic();

    const x = this.lerp(aCubic.x, bCubic.x, t);
    const y = this.lerp(aCubic.y, bCubic.y, t);
    const z = this.lerp(aCubic.z, bCubic.z, t);
    return new Hexagon(x, y, z);
  }

  static drawLine(hexA: Hexagon, hexB: Hexagon): Hexagon[] {
    if (hexA.toCubic() === hexB.toCubic()) {
      return [hexA];
    }
    const distance = this.calculateCubicDistance(hexA, hexB);

    const line: Hexagon[] = [];
    for (let i = 0; i <= distance; i++) {
      const t = i === 0 && distance === 0 ? 0 : i / distance;
      const interpolatedHex = this.cubicLerp(hexA, hexB, t);
      const rounded = this.cubicRound(interpolatedHex.toCubic());
      line.push(new Hexagon(rounded.x, rounded.y, rounded.z));
    }
    return line;
  }

  static axialRound(hex: AxialHex): AxialHex {
    return this.cubicToAxial(this.cubicRound(this.axialToCubic(hex)));
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
    return { x, y, z };
  }

  static cleanNegativeZero = (zero: number): number => {
    if (Object.is(zero, -0)) return 0;
    return zero;
  };

  // TODO: Complex methods. This methods require decomposition:
  /* begin */

  static collectWallHexagonsMap(plainBuildingNodes: AxialHex[]): boolean[][] {
    return plainBuildingNodes.reduce(
      (a: boolean[][], currentNode: AxialHex, index, array) => {
        if (index === array.length - 1) return a;
        const line = Utils.Hex.drawLine(
          new Hexagon(currentNode.x, currentNode.y),
          new Hexagon(array[index + 1].x, array[index + 1].y)
        );
        line.forEach((hex: Hexagon) => {
          const axialHex: AxialHex = hex.toAxial();

          if (!a[axialHex.x]) {
            a[axialHex.x] = [];
          }
          a[axialHex.x][axialHex.y] = true;
        });
        return a;
      },
      []
    );
  }

  static collectInteriorHexagonsMap(
    max: AxialHex,
    axialBuilding: AxialHex[],
    wallNodesMap: boolean[][]
  ): boolean[][] {
    const interiorHexagonsMap: boolean[][] = [];

    for (let x = 0; x <= max.x; x++) {
      interiorHexagonsMap[x] = [];

      for (let y = 0; y <= max.y; y++) {
        const isWall = wallNodesMap[x]?.[y] ?? false;

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
