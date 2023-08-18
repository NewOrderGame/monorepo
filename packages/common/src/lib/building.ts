import {
  Cell,
  CubicHex,
  PlainBuildingNode,
  drawLine,
  logger,
  Structural
} from '..';
import { max } from 'mathjs';

export class Building implements Structural {
  readonly map: Cell[][];
  readonly maxX: number;
  readonly maxY: number;

  constructor(
    readonly id: number,
    plainBuildingNodes: PlainBuildingNode[]
  ) {
    this.maxX = max(...plainBuildingNodes.map((node) => node.x));
    this.maxY = max(...plainBuildingNodes.map((node) => node.y));

    const wallHexagonsMap: boolean[][] =
      this.collectWallHexagonsMap(plainBuildingNodes);
    const interiorHexagonsMap: boolean[][] = this.collectInteriorHexagonsMap(
      plainBuildingNodes,
      wallHexagonsMap
    );

    this.map = this.createMap(wallHexagonsMap, interiorHexagonsMap);

    // TODO: remove this line in future
    this.printMap();
  }

  private createMap(
    wallNodesMap: boolean[][],
    interiorHexagonsMap: boolean[][]
  ): Cell[][] {
    const map: Cell[][] = [];

    for (let x = 0; x <= this.maxX; x++) {
      map[x] = [];

      for (let y = 0; y <= this.maxY; y++) {
        const isWall = wallNodesMap[x]?.[y] ?? false;
        const isInterior = interiorHexagonsMap[x]?.[y] ?? false;
        map[x][y] = new Cell(x, y, { isWall, isInterior });
      }
    }

    return map;
  }

  private collectWallHexagonsMap(
    plainBuildingNodes: PlainBuildingNode[]
  ): boolean[][] {
    return plainBuildingNodes.reduce(
      (a: boolean[][], currentNode: PlainBuildingNode, index, array) => {
        if (index === array.length - 1) return a;
        const line = drawLine(
          new CubicHex(currentNode.x, currentNode.y),
          new CubicHex(array[index + 1].x, array[index + 1].y)
        );
        line.forEach((hex) => {
          const x = hex.toMapCoordinates().x;
          const y = hex.toMapCoordinates().y;
          if (!a[x]) {
            a[x] = [];
          }
          a[x][y] = true;
        });
        return a;
      },
      []
    );
  }

  private collectInteriorHexagonsMap(
    plainBuildingNodes: PlainBuildingNode[],
    wallNodesMap: boolean[][]
  ): boolean[][] {
    const interiorHexagonsMap: boolean[][] = [];

    for (let x = 0; x <= this.maxX; x++) {
      interiorHexagonsMap[x] = [];

      for (let y = 0; y <= this.maxY; y++) {
        const isWall = wallNodesMap[x]?.[y] ?? false;

        const isInterior =
          !isWall && this.isPointInsidePolygon(x, y, plainBuildingNodes);

        interiorHexagonsMap[x][y] = isWall || isInterior;
      }
    }

    return interiorHexagonsMap;
  }

  private isPointInsidePolygon(
    x: number,
    y: number,
    plainBuildingNodes: PlainBuildingNode[]
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

      const intersect =
        yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

      if (intersect) {
        inside = !inside;
      }
    }

    return inside;
  }

  // Utility method to print the building map
  printMap(): void {
    for (let y = this.maxY; y >= 0; y--) {
      let line = '';
      for (let x = 0; x <= this.maxX; x++) {
        const cell = this.map[x][y];
        const symbol = cell.isWall ? 'X' : cell.isInterior ? 'I' : ' ';
        line += symbol;
      }
      logger.debug(line, 'RENDERED BUILDING');
    }
  }
}
