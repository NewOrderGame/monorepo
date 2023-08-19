import { CellActionPermission } from './cell-action-permission';
import { CellElement } from './cell-element';

export interface CellProps {
  actionPermission: CellActionPermission;
  element: CellElement;
}
