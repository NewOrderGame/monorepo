import { PlainBuildingNode } from './types';
import { Cell } from "./cell";

export class Building {
  readonly map: Cell[][];
  readonly maxX: number;
  readonly maxY: number;

  constructor(
    readonly id: number,
    plainBuildingNodes: PlainBuildingNode[],
  ) {
    this.maxX = Math.max(...plainBuildingNodes.map((node) => node.x));
    this.maxY = Math.max(...plainBuildingNodes.map((node) => node.y));

    const wallNodesMap: boolean[][] = plainBuildingNodes.reduce(
      (a: boolean[][], node) => {
        if (!a[node.x]) a[node.x] = [];
        a[node.x][node.y] = true;
        return a;
      },
      []
    );

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
}
