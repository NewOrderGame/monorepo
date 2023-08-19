import { Hexagon } from './hexagon';
import { CellProps } from './cell-props';
import { Hexagonal } from './hexagonal';
import { CellActionPermission } from './cell-action-permission';
import { CellElement } from './cell-element';

export class Cell extends Hexagon implements Hexagonal {
  actionPermission: CellActionPermission;
  element: CellElement;

  constructor(
    readonly props: CellProps,
    readonly x: number,
    readonly y: number,
    readonly z?: number
  ) {
    super(x, y, z);
    this.actionPermission = props.actionPermission;
    this.element = props.element;
  }
}
