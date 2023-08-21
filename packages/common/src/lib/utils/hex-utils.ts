import { Hexagon } from '../hexagon';
import { abs, max, round } from 'mathjs';
import { AxialHex, CubicHex, HexDirection } from '../types';
import { Utils } from '../..';
import cleanNegativeZero from './clean-negative-zero';
import { HexDirectionVectors } from '../hex-direction-vectors';

export default class HexUtils {
  static hexEqual(hex1: CubicHex, hex2: CubicHex): boolean {
    return hex1.x === hex2.x && hex1.y === hex2.y && hex1.z === hex2.z;
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

  static calculateCubicDistance(hexA: CubicHex, hexB: CubicHex): number {
    const dX = abs(hexA.x - hexB.x);
    const dY = abs(hexA.y - hexB.y);
    const dZ = abs(hexA.z - hexB.z);
    return max(dX, dY, dZ);
  }

  static calculateAxialDistance(axialA: AxialHex, axialB: AxialHex): number {
    const dx = axialA.x - axialB.x;
    const dy = axialB.y - axialA.y;
    return (abs(dx) + abs(dy) + abs(-dx + dy)) / 2;
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

  static drawLine(hexA: CubicHex, hexB: CubicHex): CubicHex[] {
    const distance = this.calculateCubicDistance(hexA, hexB);

    if (distance === 0) {
      return [new Hexagon(0, 0, 0).toCubic()];
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

  static axialDrawLine(nodeA: AxialHex, nodeB: AxialHex): CubicHex[] {
    const cubicA = new Hexagon(nodeA.x, nodeA.y).toCubic();
    const cubicB = new Hexagon(nodeB.x, nodeB.y).toCubic();
    return Utils.Hex.drawLine(cubicA, cubicB);
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
    return {
      x: cleanNegativeZero(x),
      y: cleanNegativeZero(y),
      z: cleanNegativeZero(z)
    };
  }

  static cubicDirection(direction: HexDirection): CubicHex {
    return HexDirectionVectors.get(direction).toCubic();
  }

  static cubicAdd(hex: CubicHex, vec: CubicHex): Hexagon {
    return new Hexagon(hex.x + vec.x, hex.y + vec.y, hex.z + vec.z);
  }

  static cubicNeighbor(cube: CubicHex, direction: HexDirection): Hexagon {
    return this.cubicAdd(cube, this.cubicDirection(direction));
  }

  static axialDirection(direction: HexDirection): AxialHex {
    return HexDirectionVectors.get(direction).toAxial();
  }

  static axialAdd(hex: AxialHex, vec: AxialHex): AxialHex {
    return new Hexagon(hex.x + vec.x, hex.y + vec.y).toAxial();
  }

  static axialNeighbor(hex: AxialHex, direction: number): AxialHex {
    return this.axialAdd(hex, this.axialDirection(direction));
  }

  // TODO: Complex methods. This methods require decomposition:
  /* begin */

  static collectWallHexagonsMap(plainBuildingNodes: AxialHex[]): boolean[][] {
    const wallMap: boolean[][] = [];

    for (let i = 0; i < plainBuildingNodes.length - 1; i++) {
      const current = plainBuildingNodes[i];
      const next = plainBuildingNodes[i + 1];

      const line = this.axialDrawLine(current, next);

      for (const hex of line) {
        const axialHex = this.cubicToAxial(hex);

        if (!wallMap[axialHex.x]) {
          wallMap[axialHex.x] = [];
        }
        wallMap[axialHex.x][axialHex.y] = true;
      }
    }
    return wallMap;
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
