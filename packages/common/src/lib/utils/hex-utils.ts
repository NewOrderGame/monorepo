import { Hexagon } from '../hexagon';
import { abs, subtract, max, round, evaluate, divide } from 'mathjs';
import { Hexagon2D } from '../types';
import { Utils } from '../..';

export default class HexUtils {
  static calculateDistance(hexA: Hexagon, hexB: Hexagon): number {
    const vX = abs(subtract(hexA.x, hexB.x));
    const vY = abs(subtract(hexA.y, hexB.y));
    const vZ = abs(subtract(hexA.z!, hexB.z!));
    return max(vX, vY, vZ);
  }

  static drawLine(hexA: Hexagon, hexB: Hexagon): Hexagon[] {
    const distance = this.calculateDistance(hexA, hexB);
    const line: Hexagon[] = [];
    for (let i = 0; i <= distance; i++) {
      const multiplier = divide(i, distance);
      const x = round(
        evaluate(`(${hexA.x} + (${hexB.x} - ${hexA.x}) * ${multiplier})`)
      );
      const z = round(
        evaluate(
          `(${hexA.z} + (${hexB.z} - ${hexA.z}) * ${multiplier}) - 0.001`
        )
      );
      const y = evaluate(`-${x} -${z}`);
      line.push(new Hexagon(x, y, z));
    }
    return line;
  }

  static collectWallHexagonsMap(plainBuildingNodes: Hexagon2D[]): boolean[][] {
    return plainBuildingNodes.reduce(
      (a: boolean[][], currentNode: Hexagon2D, index, array) => {
        if (index === array.length - 1) return a;
        const line = Utils.Hex.drawLine(
          new Hexagon(currentNode.x, currentNode.y),
          new Hexagon(array[index + 1].x, array[index + 1].y)
        );
        line.forEach((hex: Hexagon) => {
          const hex2D: Hexagon2D = hex.to2D();

          if (!a[hex2D.x]) {
            a[hex2D.x] = [];
          }
          a[hex2D.x][hex2D.y] = true;
        });
        return a;
      },
      []
    );
  }

  static collectInteriorHexagonsMap(
    max: Hexagon2D,
    building2D: Hexagon2D[],
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
    hex2D: Hexagon2D,
    plainBuildingNodes: Hexagon2D[]
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
