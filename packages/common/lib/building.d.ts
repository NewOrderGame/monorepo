import { PlainBuildingNode } from './types';
import { Cell } from "./cell";
export declare class Building {
    readonly id: number;
    readonly map: Cell[][];
    readonly maxX: number;
    readonly maxY: number;
    constructor(id: number, plainBuildingNodes: PlainBuildingNode[]);
    getMap(): Cell[][];
    getCell(x: number, y: number): Cell;
    private collectWallNodesMap;
}
