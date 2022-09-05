import { PlainBuildingNode } from '../../../location-site/src/lib/types';

export class Cell {
  readonly isWall: boolean;

  constructor(
    readonly x: number,
    readonly y: number,
    options: { isWall: boolean }
  ) {
    this.isWall = options?.isWall || false;
  }

  public getIsWall() {
    return this.isWall;
  }
}

export class Building {
  readonly map: Cell[][];
  readonly maxX: number;
  readonly maxY: number;

  constructor(plainBuildingNodes: PlainBuildingNode[]) {
    this.maxX = Math.max(...plainBuildingNodes.map((node) => node.x));
    this.maxY = Math.max(...plainBuildingNodes.map((node) => node.y));

    const wallNodesMap: boolean[][] =
      this.buildWallNodesMap(plainBuildingNodes);

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

  private buildWallNodesMap(
    plainBuildingNodes: PlainBuildingNode[]
  ): boolean[][] {
    return plainBuildingNodes.reduce((a: boolean[][], node) => {
      if (!a[node.x]) a[node.x] = [];
      a[node.x][node.y] = true;
      return a;
    }, []);
  }
}
