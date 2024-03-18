import { GeoCoordinates, NogEvent, logger } from '@newordergame/common';
import { Socket } from 'socket.io';
import { getEncounterSocket } from './store/encounter-socket-store';
import characterStore from './store/character-store';

export const handleLookAround =
  (socket: Socket) => (coordinates: GeoCoordinates) => {
    const encounterSocket = getEncounterSocket();
    const characterId = socket.data.characterId;

    if (!characterId) {
      logger.error('Character ID is missing');
      return;
    }

    if (!encounterSocket) {
      logger.error(
        { characterId, coordinates },
        'Enter building failed. Location site socket missing.'
      );
      return;
    }

    const character = characterStore.get(characterId);

    encounterSocket.emit(NogEvent.LOOK_AROUND, {
      characterId,
      coordinates,
      character
    });
  };
