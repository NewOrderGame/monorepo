import { GeoCoordinates, logger } from '@newordergame/common';
import { Socket } from 'socket.io-client';

export const handleCreateEncounter =
  (gameSocket: Socket) =>
  async ({
    characterIdA,
    characterIdB,
    coordinates
  }: {
    characterIdA: string;
    characterIdB: string;
    coordinates: GeoCoordinates;
  }) => {
    try {
      logger.info({ gameSocket }, 'CREATING encounter');
    } catch (error) {
      logger.error({ error, characterIdA, characterIdB, coordinates });
    }
  };
