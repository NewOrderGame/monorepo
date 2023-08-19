import { Hexagon } from '../hexagon';
import { abs, subtract, max, round, evaluate, divide } from 'mathjs';
import { AxialHex } from '../types';
import { Utils } from '../..';

export default class HexUtils {
  static calculateDistance(hexA: Hexagon, hexB: Hexagon): number {
    const aCubic = hexA.toCubic();
    const bCubic = hexB.toCubic();
    const vX = abs(subtract(aCubic.x, bCubic.x));
    const vY = abs(subtract(aCubic.y, bCubic.y));
    const vZ = abs(subtract(aCubic.z, bCubic.z));
    return max(vX, vY, vZ);
  }

  static drawLine(hexA: Hexagon, hexB: Hexagon): Hexagon[] {
    const distance = this.calculateDistance(hexA, hexB);
    const line: Hexagon[] = [];
    for (let i = 0; i <= distance; i++) {
      const aCubic = hexA.toCubic();
      const bCubic = hexB.toCubic();
      const multiplier = divide(i, distance);
      const x = round(
        evaluate(`(${aCubic.x} + (${bCubic.x} - ${aCubic.x}) * ${multiplier})`)
      );
      const z = round(
        evaluate(
          `(${aCubic.z} + (${bCubic.z} - ${aCubic.z}) * ${multiplier}) - 0.001`
        )
      );
      const y = evaluate(`-${x} -${z}`);
      line.push(new Hexagon(x, y, z));
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
    building2D: AxialHex[],
    wallNodesMap: boolean[][]
  ): boolean[][] {
    const interiorHexagonsMap: boolean[][] = [];

    for (let x = 0; x <= max.x; x++) {
      interiorHexagonsMap[x] = [];

      for (let y = 0; y <= max.y; y++) {
        const isWall = wallNodesMap[x]?.[y] ?? false;

        const isInterior =
          !isWall && this.isHexInsidePolygon({ x, y }, building2D);

        interiorHexagonsMap[x][y] = isWall || isInterior;
      }
    }

    return interiorHexagonsMap;
  }

  static isHexInsidePolygon(
    hex2D: AxialHex,
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

      const isAboveStart = yi > hex2D.y;
      const isAboveEnd = yj > hex2D.y;
      const isCrossingHorizontal = isAboveStart !== isAboveEnd;

      const intersectionX = ((xj - xi) * (hex2D.y - yi)) / (yj - yi) + xi;
      const isToLeftOfPoint = hex2D.x < intersectionX;

      const intersect = isCrossingHorizontal && isToLeftOfPoint;

      if (intersect) {
        inside = !inside;
      }
    }

    return inside;
  }
}
