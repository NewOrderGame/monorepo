import {
  AxialHex,
  Cell,
  CellActionPermission,
  CellElement,
  Hexagon,
  Structural,
  logger
} from '..';
import { max } from 'mathjs';

export class Building implements Structural {
  readonly maxX: number;
  readonly maxY: number;
  readonly map: Cell[][];

  constructor(
    readonly id: number,
    plainBuildingNodes: AxialHex[]
  ) {
    this.id = id;
    this.maxX = max(...plainBuildingNodes.map((node) => node.x));
    this.maxY = max(...plainBuildingNodes.map((node) => node.y));

    const wallHexagonsMap: boolean[][] =
      Hexagon.collectWallHexagonsMap(plainBuildingNodes);
    const interiorHexagonsMap: boolean[][] = Hexagon.collectInteriorHexagonsMap(
      { x: this.maxX, y: this.maxY },
      plainBuildingNodes,
      wallHexagonsMap
    );

    this.map = this.createMap({ wallHexagonsMap, interiorHexagonsMap });

    logger.debug(this.buildPreviewMap(), 'RENDERED BUILDING');
  }

  private createMap({
    wallHexagonsMap,
    interiorHexagonsMap
  }: {
    wallHexagonsMap: boolean[][];
    interiorHexagonsMap: boolean[][];
  }): Cell[][] {
    const map: Cell[][] = [];

    for (let x = 0; x <= this.maxX; x++) {
      map[x] = [];

      for (let y = 0; y <= this.maxY; y++) {
        const isWall = wallHexagonsMap[x]?.[y] ?? false;
        const isInterior = interiorHexagonsMap[x]?.[y] ?? false;

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
