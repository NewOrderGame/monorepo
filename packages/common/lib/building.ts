import { PlainBuildingNode } from './types';
import { Cell } from './cell';
import { drawLine } from './hex-utils';
import { CubicHex } from './cubic-hex';

export class Building {
  readonly map: Cell[][];
  readonly maxX: number;
  readonly maxY: number;

  constructor(readonly id: number, plainBuildingNodes: PlainBuildingNode[]) {
    this.maxX = Math.max(...plainBuildingNodes.map((node) => node.x));
    this.maxY = Math.max(...plainBuildingNodes.map((node) => node.y));

    const wallNodesMap: boolean[][] =
      this.collectWallNodesMap(plainBuildingNodes);

    this.map = [];
    for (let x = 0; x < this.maxX + 1; x++) {
      if (!this.map[x]) this.map[x] = [];
      for (let y = 0; y < this.maxY + 1; y++) {
        this.map[x][y] = new Cell(x, y, { isWall: !!wallNodesMap[x]?.[y] });
      }
    }
  }

  public getMap() {
    return this.map;
  }

  public getCell(x: number, y: number) {
    if (x > this.maxX || y > this.maxY)
      throw new Error('The cell is out of boundaries');
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
}
