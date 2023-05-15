export class Cell {
  readonly isWall: boolean;
  readonly isInterior: boolean;

  constructor(readonly x: number, readonly y: number, options: CellOptions) {
    this.isWall = options.isWall || false;
    this.isInterior = options.isInterior || false;
  }
}

export interface CellOptions {
  isWall: boolean;
  isInterior: boolean;
}
