import { Coordinates, Hexagon2D, WayOverpassElement } from '../types';
import { abs, add, evaluate, max, min, round, subtract, sqrt } from 'mathjs';
import { getDistance, getGreatCircleBearing, isPointInPolygon } from 'geolib';

export default class OverpassUtils {
  static convertWayToPlainBuildingNodes(
    building: WayOverpassElement
  ): Hexagon2D[] {
    const longestWallNodeIndex = this.determineLongestWallIndex(building);
    const longestWallNode = building.geometry[longestWallNodeIndex];
    const secondWallNode = building.geometry[longestWallNodeIndex + 1];

    const longestWallBearing = getGreatCircleBearing(
      longestWallNode,
      secondWallNode
    );
    const rawPlainBuilding = building.geometry.map((node) => {
      const distance = getDistance(longestWallNode, node, 0.00001);
      const bearing = getGreatCircleBearing(longestWallNode, node);
      const bearingDelta = subtract(bearing, longestWallBearing);

      return {
        x: round(evaluate(`${distance} * cos(${bearingDelta} deg)`)),
        y: round(evaluate(`${distance} * sin(${bearingDelta} deg)`))
      };
    });

    const minX = min(...rawPlainBuilding.map((node) => node.x));
    const minY = min(...rawPlainBuilding.map((node) => node.y));

    return rawPlainBuilding.map((node) => ({
      x: add(node.x, abs(minX)),
      y: add(node.y, abs(minY))
    }));
  }

  static determineLongestWallIndex(building: WayOverpassElement): number {
    const geometry = building.geometry.slice(0, building.geometry.length - 1);
    const distances = geometry.map((node, index) => {
      const next = index === geometry.length - 1 ? 0 : index + 1;
      const xDiff = node.lon - geometry[next].lon;
      const yDiff = node.lat - geometry[next].lat;
      return sqrt(xDiff * xDiff + yDiff * yDiff);
    });
    return distances.indexOf(max(...distances));
  }

  static determineBuilding(
    coordinates: Coordinates,
    elements: WayOverpassElement[]
  ) {
    return (
      elements.find((way: WayOverpassElement) => {
        return isPointInPolygon(coordinates, way.geometry);
      }) || null
    );
  }
}
