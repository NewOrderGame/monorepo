import { Hexagon } from '../hexagon';
import { abs, subtract, max } from 'mathjs';
import { AxialHex, CubicHex, DoubledCoordinate, OffsetHex } from '../types';
import { EPSILON, Utils } from '../..';

export default class HexUtils {
  static cubicToAxial(cubic: CubicHex): AxialHex {
    return { x: cubic.x, y: cubic.z };
  }

  static axialToCubic(axial: AxialHex): CubicHex {
    const z = -axial.x - axial.y;
    return { x: axial.x, y: axial.y, z: z };
  }

  static calculateCubicDistance(hexA: Hexagon, hexB: Hexagon): number {
    const aCubic = hexA.toCubic();
    const bCubic = hexB.toCubic();
    const vX = abs(subtract(aCubic.x, bCubic.x));
    const vY = abs(subtract(aCubic.y, bCubic.y));
    const vZ = abs(subtract(aCubic.z, bCubic.z));
    return max(vX, vY, vZ);
  }

  static calculateAxialDistance(axialA: AxialHex, axialB: AxialHex): number {
    const dq = axialA.x - axialB.x;
    const dr = axialA.y - axialB.y;
    return (Math.abs(dq) + Math.abs(dq + dr) + Math.abs(dr)) / 2;
  }

  static offsetToAxial(offset: OffsetHex): AxialHex {
    const x = offset.col;
    const y = offset.row - (offset.col - (offset.col & 1)) / 2;
    return { x: x, y: y };
  }

  static offsetToCubic(offset: OffsetHex): CubicHex {
    const axial = this.offsetToAxial(offset);
    return {
      x: axial.x,
      y: axial.y,
      z: -axial.x - axial.y
    };
  }

  static calculateOffsetDistance(
    offsetA: OffsetHex,
    offsetB: OffsetHex
  ): number {
    const axialA = this.offsetToAxial(offsetA);
    const axialB = this.offsetToAxial(offsetB);
    return this.calculateAxialDistance(axialA, axialB);
  }

  private static lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
  }

  private static cubeLerp(hexA: Hexagon, hexB: Hexagon, t: number): Hexagon {
    const aCubic = hexA.toCubic();
    const bCubic = hexB.toCubic();

    const x = this.lerp(aCubic.x, bCubic.x, t);
    const y = this.lerp(aCubic.y, bCubic.y, t);
    const z = this.lerp(aCubic.z, bCubic.z, t);
    return new Hexagon(x, y, z);
  }

  static doubleWidthDistance(
    a: DoubledCoordinate,
    b: DoubledCoordinate
  ): number {
    const dCol = Math.abs(a.col - b.col);
    const dRow = Math.abs(a.row - b.row);
    return dRow + Math.max(0, (dCol - dRow) / 2);
  }

  static doubleHeightDistance(
    a: DoubledCoordinate,
    b: DoubledCoordinate
  ): number {
    const dCol = Math.abs(a.col - b.col);
    const dRow = Math.abs(a.row - b.row);
    return dCol + Math.max(0, (dRow - dCol) / 2);
  }

  // TODO: this method works with a bug. Gape in the walls during manual testing via UI
  // !!!
  static drawLine(hexA: Hexagon, hexB: Hexagon): Hexagon[] {
    const distance = this.calculateCubicDistance(hexA, hexB);
    const aCubic = hexA.toCubic();
    const bCubic = hexB.toCubic();
    const nudgedA = new Hexagon(
      aCubic.x + EPSILON,
      aCubic.y + 2 * EPSILON,
      aCubic.z - 3 * EPSILON
    );
    const nudgedB = new Hexagon(
      bCubic.x + EPSILON,
      bCubic.y + 2 * EPSILON,
      bCubic.z - 3 * EPSILON
    );

    const line: Hexagon[] = [];
    for (let i = 0; i <= distance; i++) {
      const t = i / distance;
      const interpolatedHex = this.cubeLerp(nudgedA, nudgedB, t);
      const cubicInterpolatedHex = interpolatedHex.toCubic();
      line.push(
        new Hexagon(
          Math.round(cubicInterpolatedHex.x),
          Math.round(cubicInterpolatedHex.y),
          Math.round(cubicInterpolatedHex.z)
        )
      );
    }
    return line;
  }

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
}
