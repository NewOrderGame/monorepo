import { Hexagon } from './hexagon';
import { CellProps } from './cell-props';
import { Hexagonal } from './hexagonal';
import { CellActionPermission } from './enums';
import { CellElement } from './enums';
import { CubicHex } from './types';

export class Cell extends Hexagon implements Hexagonal {
  actionPermission: CellActionPermission;
  element: CellElement;
  neighbors: CubicHex[];

  constructor(props: CellProps, x: number, y: number, z?: number) {
    super(x, y, z);
    this.actionPermission = props.actionPermission;
    this.element = props.element;

    this.neighbors = [];
    for (let d = 0; d < Hexagon.DIRECTIONS_QUANTITY; d++) {
      const neighbor = Hexagon.cubicNeighbor(this, d);
      this.neighbors[d] = neighbor;
    }
  }
}
