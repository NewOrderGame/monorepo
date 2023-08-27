import { Cell } from './cell';
import { CellActionPermission, CellElement } from './enums';
import { Hexagon } from './hexagon';
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

    logger.debug(this.buildPreviewMap(), 'RENDERED MAP');
  }

  static getReachable(hexMap: HexMap, cell: Cell, steps: number): Cell[] {
    const axialCell = Hexagon.cubicToAxial(cell);

    const visited: Set<Cell> = new Set();
    const fringes: Cell[][] = [];
    const startCell = hexMap.map[axialCell.x][axialCell.y];
    visited.add(startCell);
    fringes.push([startCell]);

    logger.debug({ cell }, 'cell');
    if (startCell.actionPermission < CellActionPermission.PASS) {
      return Array.from(visited);
    }

    for (let k = 1; k <= steps; k++) {
      fringes.push([]);
      for (const cell of fringes[k - 1]) {
        for (let d = 0; d < Hexagon.DIRECTIONS_QUANTITY; d++) {
          const axialNeighbor = Hexagon.cubicToAxial(
            Hexagon.cubicNeighbor(cell, d)
          );
          if (
            axialNeighbor.x > hexMap.maxX ||
            axialNeighbor.y > hexMap.maxY ||
            axialNeighbor.x < 0 ||
            axialNeighbor.y < 0
          ) {
            continue;
          }

          const neighborCell = hexMap.map[axialNeighbor.x][axialNeighbor.y];

          if (
            !visited.has(neighborCell) &&
            neighborCell.actionPermission >= CellActionPermission.PASS
          ) {
            visited.add(hexMap.map[axialNeighbor.x][axialNeighbor.y]);
            fringes[k].push(hexMap.map[axialNeighbor.x][axialNeighbor.y]);
          }
        }
      }
    }

    return Array.from(visited);
  }

  static getPath(hexMap: HexMap, startCell: Cell, goalCell: Cell): Cell[] {
    function heuristic(cellA: Cell, cellB: Cell): number {
      const a = Hexagon.cubicToAxial(cellA);
      const b = Hexagon.cubicToAxial(cellB);
      return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    }

    const openList: Cell[] = [startCell];
    const closedList: Set<Cell> = new Set();
    const cameFrom = new Map<Cell, Cell>();
    const gScore = new Map<Cell, number>();
    const fScore = new Map<Cell, number>();

    gScore.set(startCell, 0);
    fScore.set(startCell, heuristic(startCell, goalCell));

    while (openList.length) {
      openList.sort((a, b) => fScore.get(a)! - fScore.get(b)!);
      const current = openList.shift()!;
      closedList.add(current);

      if (current === goalCell) {
        const path: Cell[] = [];
        let temp: Cell | undefined = current;
        while (temp) {
          path.unshift(temp);
          temp = cameFrom.get(temp);
        }
        return path;
      }

      for (let d = 0; d < Hexagon.DIRECTIONS_QUANTITY; d++) {
        const axialNeighbor = Hexagon.cubicToAxial(
          Hexagon.cubicNeighbor(current, d)
        );
        if (
          axialNeighbor.x > hexMap.maxX ||
          axialNeighbor.y > hexMap.maxY ||
          axialNeighbor.x < 0 ||
          axialNeighbor.y < 0
        ) {
          continue;
        }

        const neighbor = hexMap.map[axialNeighbor.x][axialNeighbor.y];
        if (
          neighbor.actionPermission < CellActionPermission.PASS ||
          closedList.has(neighbor)
        ) {
          continue;
        }

        const tentativeGScore = gScore.get(current)! + 1;
        if (tentativeGScore < (gScore.get(neighbor) || Infinity)) {
          cameFrom.set(neighbor, current);
          gScore.set(neighbor, tentativeGScore);
          fScore.set(neighbor, tentativeGScore + heuristic(neighbor, goalCell));

          if (!openList.includes(neighbor)) {
            openList.push(neighbor);
          }
        }
      }
    }

    return [];
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
          const hasObstacle = Math.random() > 0.8;

          if (!hasObstacle) {
            element = CellElement.FLOOR;
            actionPermission = CellActionPermission.STAY;
          } else {
            element = CellElement.ROCK;
            actionPermission = CellActionPermission.INTERACT;
          }
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
