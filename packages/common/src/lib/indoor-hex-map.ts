import { AxialHex, Hexagon, Indoor } from '..';
import { BoolHexMap, BoolHexMaps, HexMap } from './hex-map';

export class IndoorHexMap extends HexMap implements Indoor {
  constructor(
    id: string,
    readonly buildingId: string,
    readonly floorNumber: number,
    plainBuildingNodes: AxialHex[]
  ) {
    const maxX = Math.max(...plainBuildingNodes.map((node) => node.x));
    const maxY = Math.max(...plainBuildingNodes.map((node) => node.y));

    const exteriorWallsAxialHexMap: BoolHexMap =
      Hexagon.collectExteriorWallsHexMap(plainBuildingNodes);
    const interiorAxialHexMap: BoolHexMap = Hexagon.collectInteriorHexMap(
      { x: maxX, y: maxY },
      plainBuildingNodes,
      exteriorWallsAxialHexMap
    );

    const maps: BoolHexMaps = {
      exteriorWallsAxialHexMap,
      interiorAxialHexMap
    };

    super(id, maxX, maxY, maps);
  }
}
