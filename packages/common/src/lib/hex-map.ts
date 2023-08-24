import { Cell } from './cell';
import { CellActionPermission, CellElement } from './enums';
import { HexagonalMap } from './hexagonal-map';
import { logger } from './logger';

export enum BoolHexMapName {
  EXTERIOR_WALLS = 'exteriorWallsAxialHexMap',
  INTERIOR = 'interiorAxialHexMap'
}
export type BoolHexMap = boolean[][];
export type BoolHexMaps = Record<BoolHexMapName, boolean[][]>;

export class HexMap implements HexagonalMap {
  readonly map: Cell[][];

  constructor(
    readonly id: string,
    readonly maxX: number,
    readonly maxY: number,
    maps: BoolHexMaps
  ) {
    this.map = this.buildMap(maps);

    logger.debug(this.buildPreviewMap(), 'RENDERED BUILDING');
  }

  private buildMap({
    exteriorWallsAxialHexMap,
    interiorAxialHexMap
  }: BoolHexMaps): Cell[][] {
    const map: Cell[][] = [];

    for (let x = 0; x <= this.maxX; x++) {
      map[x] = [];

      for (let y = 0; y <= this.maxY; y++) {
        const isWall = exteriorWallsAxialHexMap[x]?.[y] ?? false;
        const isInterior = interiorAxialHexMap[x]?.[y] ?? false;

        let element: CellElement;
        let actionPermission: CellActionPermission;

        if (isWall) {
          element = CellElement.WALL;
          actionPermission = CellActionPermission.INTERACT;
        } else if (isInterior) {
          element = Math.random() < 0.8 ? CellElement.FLOOR : CellElement.ROCK;
          actionPermission = CellActionPermission.STAY;
        } else {
          element = CellElement.VOID;
          actionPermission = CellActionPermission.NONE;
        }

        const cell = new Cell({ element, actionPermission }, x, y);
        map[x][y] = cell;
      }
    }

    return map;
  }

  // Utility method to print the building map
  buildPreviewMap(): string[] {
    const map = [];
    for (let y = this.maxY; y >= 0; y--) {
      let line = '';
      for (let x = 0; x <= this.maxX; x++) {
        const cell = this.map[x][y];
        const symbol =
          cell.element === CellElement.WALL
            ? 'X'
            : cell.element === CellElement.FLOOR
            ? 'I'
            : ' ';
        line += symbol;
      }
      map.push(line);
    }
    return map;
  }
}
