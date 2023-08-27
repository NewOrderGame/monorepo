import { AxialHex, Hexagon, Indoor } from '..';
import { BoolHexMapLayer, BoolHexMapLayers, HexMap } from './hex-map';

export class IndoorHexMap extends HexMap implements Indoor {
  constructor(
    id: string,
    readonly buildingId: string,
    readonly floorNumber: number,
    plainBuildingNodes: AxialHex[]
  ) {
    const maxX = Math.max(...plainBuildingNodes.map((node) => node.x));
    const maxY = Math.max(...plainBuildingNodes.map((node) => node.y));

    const exteriorWallsBoolHexMapLayer: BoolHexMapLayer =
      Hexagon.collectExteriorWallsBoolHexMap(plainBuildingNodes);
    const interiorBoolHexMapLayer: BoolHexMapLayer =
      Hexagon.collectInteriorBoolHexMap(
        { x: maxX, y: maxY },
        plainBuildingNodes,
        {
          exteriorWallsBoolHexMapLayer
        }
      );

    const maps: BoolHexMapLayers = {
      exteriorWallsBoolHexMapLayer,
      interiorBoolHexMapLayer
    };

    super(id, maxX, maxY, maps);
  }
}
