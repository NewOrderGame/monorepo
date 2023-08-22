import { CellActionPermission } from './enums';
import { CellElement } from './enums';

export interface CellProps {
  actionPermission: CellActionPermission;
  element: CellElement;
}
