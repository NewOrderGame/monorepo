import {
  Cell,
  CubicHex,
  PlainBuildingNode,
  drawLine
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

    this.map = [];
    for (let x = 0; x <= this.maxX; x++) {
      this.map[x] = [];
      for (let y = 0; y <= this.maxY; y++) {
        const isWall = wallNodesMap[x]?.[y] ?? false;
        const isInterior = interiorHexagonsMap[x]?.[y] ?? false;
        this.map[x][y] = new Cell(x, y, {
          isWall,
          isInterior
        });
      }
    }
  }

  public getMap() {
    return this.map;
  }

  public getCell(x: number, y: number) {
    if (x > this.maxX || y > this.maxY) {
      throw new Error('The cell is out of boundaries');
    }
    return this.map[x][y];
  }

  private collectWallNodesMap(
    plainBuildingNodes: PlainBuildingNode[]
  ): boolean[][] {
    return plainBuildingNodes.reduce(
      (a: boolean[][], currentNode: PlainBuildingNode, index, array) => {
        if (index === array.length - 1) return a;
        const line = drawLine(
          new CubicHex(currentNode.x, currentNode.y),
          new CubicHex(array[index + 1].x, array[index + 1].y)
        );
        line.forEach((hex: any) => {
          const { x, y } = hex.toMapCoordinates();
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
        const hex = new CubicHex(x, y);
        const isWall = wallNodesMap[x]?.[y] ?? false;
        const isInterior = this.isHexagonInterior(
          hex,
          plainBuildingNodes,
          wallNodesMap
        );

        interiorHexagonsMap[x][y] = isWall || isInterior;
      }
    }

    return interiorHexagonsMap;
  }

  private isHexagonInterior(
    hex: CubicHex,
    plainBuildingNodes: PlainBuildingNode[],
    wallNodesMap: boolean[][]
  ): boolean {
    let inside = false;
    const x = hex.toMapCoordinates().x;
    const y = hex.toMapCoordinates().y;

    for (
      let i = 0, j = plainBuildingNodes.length - 1;
      i < plainBuildingNodes.length;
      j = i++
    ) {
      const xi = plainBuildingNodes[i].x;
      const yi = plainBuildingNodes[i].y;
      const xj = plainBuildingNodes[j].x;
      const yj = plainBuildingNodes[j].y;

      // Check if the cell is outside the boundary or a wall node
      if (
        yi > y !== yj > y &&
        x < ((xj - xi) * (y - yi)) / (yj - yi) + xi &&
        !wallNodesMap[x]?.[y]
      ) {
        inside = !inside;
      }
    }

    return inside;
  }
}
