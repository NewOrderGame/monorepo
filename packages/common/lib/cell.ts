export class Cell {
  readonly isWall: boolean;

  constructor(
    readonly x: number,
    readonly y: number,
    options: CellOptions
  ) {
    this.isWall = options.isWall || false;
  }
}

export interface CellOptions {
  isWall: boolean;
}