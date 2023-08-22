import { Hexagon } from './hexagon';
import { CellProps } from './cell-props';
import { Hexagonal } from './hexagonal';
import { CellActionPermission } from './enums';
import { CellElement } from './enums';

export class Cell extends Hexagon implements Hexagonal {
  actionPermission: CellActionPermission;
  element: CellElement;

  constructor(
    readonly props: CellProps,
    x: number,
    y: number,
    z?: number
  ) {
    super(x, y, z);
    this.actionPermission = props.actionPermission;
    this.element = props.element;
  }
}
