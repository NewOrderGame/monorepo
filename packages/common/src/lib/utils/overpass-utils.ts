import { GeoCoordinates, WayOverpassElement } from '../types';
import { isPointInPolygon } from 'geolib';
import axios from 'axios';
import { computeDestinationPoint } from 'geolib';
import { multiply } from 'mathjs';
import {
  OVERPASS_API_BUILDINGS_SKELS_QUERY,
  OVERPASS_API_INTERPRETER_PATH,
  OVERPASS_API_URL
} from '../..';

export default class OverpassUtils {
  static determineBuilding(
    coordinates: GeoCoordinates,
    elements: WayOverpassElement[]
  ): WayOverpassElement | null {
    return (
      elements.find((way: WayOverpassElement) => {
        return isPointInPolygon(coordinates, way.geometry);
      }) || null
    );
  }

  static getBuildingsInSight(coordinates: GeoCoordinates, sightRange: number) {
    const min = computeDestinationPoint(
      coordinates,
      multiply(sightRange, 2),
      225 // bottom left
    );
    const max = computeDestinationPoint(
      coordinates,
      multiply(sightRange, 2),
      45 // top right
    );

    if (!min.longitude || !min.latitude || !max.longitude || !max.latitude) {
      throw new Error('Error during getting min and max boundary points');
    }

    const uri = `${OVERPASS_API_URL}${OVERPASS_API_INTERPRETER_PATH}?data=${OVERPASS_API_BUILDINGS_SKELS_QUERY}&bbox=${min.longitude},${min.latitude},${max.longitude},${max.latitude}`;

    return axios.get(uri).then((response) => response.data);
  }
}
