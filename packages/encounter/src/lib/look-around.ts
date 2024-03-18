import {
  Character,
  GeoCoordinates,
  NogEvent,
  Utils,
  WayOverpassElement,
  logger
} from '@newordergame/common';
import { Socket } from 'socket.io-client';

export const handleLookAround =
  (gameSocket: Socket) =>
  async ({
    characterId,
    coordinates,
    character
  }: {
    characterId: string;
    coordinates: GeoCoordinates;
    character: Character;
  }) => {
    try {
      const buildingsInSight = await Utils.Overpass.getBuildingsInSight(
        coordinates,
        character.stats.sightRange
      );
      const wayBuilding: WayOverpassElement | null =
        Utils.Overpass.determineBuilding(
          coordinates,
          buildingsInSight?.elements
        );

      if (wayBuilding) {
        const buildingId = wayBuilding.id;
        gameSocket.emit(NogEvent.LOOK_AROUND_COMMIT, {
          characterId
        });
        logger.info({ characterId, buildingId }, 'Looking at the building');
      } else {
        // go to llama
      }
    } catch (error) {
      logger.error({ error, coordinates, character });
    }
  };
