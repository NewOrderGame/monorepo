import {
  Cell,
  CubicHex,
  drawLine,
  PlainBuildingNode
} from '@newordergame/common';
import logger from './utils/logger';

export class Building {
  readonly map: Cell[][];
  readonly maxX: number;
  readonly maxY: number;

  constructor(readonly id: number, plainBuildingNodes: PlainBuildingNode[]) {
    this.maxX = Math.max(...plainBuildingNodes.map((node) => node.x));
    this.maxY = Math.max(...plainBuildingNodes.map((node) => node.y));

    const wallNodesMap: boolean[][] =
      this.collectWallNodesMap(plainBuildingNodes);
    const interiorHexagonsMap: boolean[][] = this.collectInteriorHexagonsMap(
      plainBuildingNodes,
      wallNodesMap
    );

    this.map = this.createMap(wallNodesMap, interiorHexagonsMap);

    // TODO: remove this line
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

  private collectWallNodesMap(
    plainBuildingNodes: PlainBuildingNode[]
  ): boolean[][] {
    return plainBuildingNodes.reduce(
      (
        wallNodesMap: boolean[][],
        currentNode: PlainBuildingNode,
        index,
        array
      ) => {
        if (index === array.length - 1) return wallNodesMap;

        const line = drawLine(
          new CubicHex(currentNode.x, currentNode.y),
          new CubicHex(array[index + 1].x, array[index + 1].y)
        );

        line.forEach((hex: any) => {
          const { x, y } = hex.toMapCoordinates();
          if (!wallNodesMap[x]) {
            wallNodesMap[x] = [];
          }
          wallNodesMap[x][y] = true;
        });

        return wallNodesMap;
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
        const hex = new CubicHex(x, y);
        const isWall = wallNodesMap[x]?.[y] ?? false;
        const isInterior = this.isHexagonInterior(
          hex,
          plainBuildingNodes,
        );
        interiorHexagonsMap[x][y] = isWall || isInterior;
      }
    }

    return interiorHexagonsMap;
  }

  private isHexagonInterior(
    hex: CubicHex,
    plainBuildingNodes: PlainBuildingNode[],
  ): boolean {
    let inside = false;
    const { x, y } = hex.toMapCoordinates();

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
