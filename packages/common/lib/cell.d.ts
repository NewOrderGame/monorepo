export declare class Cell {
    readonly x: number;
    readonly y: number;
    readonly isWall: boolean;
    constructor(x: number, y: number, options: CellOptions);
}
export interface CellOptions {
    isWall: boolean;
}
