import {
  logger,
  Character,
  CharacterAtWorld,
  characterAtWorldSchema,
  characterIdSchema,
  Coordinates,
  coordinatesSchema,
  NogCharacterId,
  NogEvent,
  NogPage,
  numberSchema
} from '@newordergame/common';
import {
  DISTANCE_ACCURACY,
  NPC_GENERATION_CHANCE_PER_TICK,
  NPC_GENERATION_THRESHOLD
} from './utils/constants';
import { createCharacterAtWorld } from './character-at-world';
import { nanoid } from 'nanoid';
import characterAtWorldStore from '../store/character-at-world-store';
import { Socket } from 'socket.io';
import { getNpcSocket, setNpcSocket } from '../store/npc-socket-store';
import characterStore from '../store/character-store';
import { getDistance as computeDistance } from 'geolib';

export const handleNpcServiceConnection = (npcSocket: Socket) => {
  const isNpcService =
    npcSocket.handshake.auth.npcServiceSecret ===
    process.env.NOG_NPC_SERVICE_SECRET;

  if (!isNpcService) {
    return;
  }

  logger.info('NPC service connected');
  const allNpc = characterAtWorldStore.getAllNpc();
  setNpcSocket(npcSocket);
  npcSocket.emit(NogEvent.INIT_NPC, allNpc);
  allNpc.forEach((npc) => npcSocket.join(npc.characterId));

  npcSocket.on(NogEvent.CREATE_NPC, (coordinates: Coordinates) => {
    logger.info({ coordinates }, 'Create NPC');

    try {
      coordinatesSchema.validateSync(coordinates);
    } catch (error) {
      logger.error(error, 'Error during handling Create NPC event');
      return;
    }

    const defaultNpc: Character = {
      characterId: `NPC-${nanoid()}` as NogCharacterId,
      nickname: nanoid(),
      coordinates: {
        lat: coordinates.lat,
        lng: coordinates.lng
      },
      connected: true,
      encounterId: null,
      encounterEndTime: null,
      encounterStartTime: null,
      buildingId: null,
      page: NogPage.WORLD,
      stats: {
        sightRange: 100,
        speed: 30,
        outlook: {
          0: Math.random() * 200 - 100,
          1: Math.random() * 200 - 100,
          2: Math.random() * 200 - 100
        }
      }
    };

    const npc = createCharacterAtWorld({
      character: defaultNpc,
      isNpc: true
    });

    characterStore.set(defaultNpc.characterId, defaultNpc);
    characterAtWorldStore.set(npc.characterId, npc);
    npcSocket.join(npc.characterId);
    npcSocket.emit(NogEvent.INIT_NPC, [npc]);
  });

  npcSocket.on(NogEvent.DESTROY_NPC, (characterIds: string[]) => {
    characterIds.forEach((characterId) => {
      logger.info({ characterId }, 'Destroy NPC');

      try {
        characterIdSchema.validateSync(characterId);
      } catch (error) {
        logger.error(error, 'Error during destroying NPC');
        return;
      }

      characterStore.delete(characterId);
      characterAtWorldStore.delete(characterId);
      npcSocket.leave(characterId);
      npcSocket.emit(NogEvent.DESTROY_NPC, [{ characterId }]);
    });
  });

  npcSocket.on(
    NogEvent.MOVE_NPC_AT_WORLD,
    ({
      coordinates,
      characterId
    }: {
      coordinates: Coordinates;
      characterId: string;
    }) => {
      logger.info({ coordinates, characterId }, 'Move NPC at world');

      try {
        coordinatesSchema.validateSync(coordinates);
        characterIdSchema.validateSync(characterId);
      } catch (error) {
        logger.error(error, 'Error during move NPC at world');
        return;
      }

      const characterAtWorld = characterAtWorldStore.get(characterId);

      if (!characterAtWorld) {
        logger.warn({ characterId }, 'This NPC seems to be gone...');
        return;
      }

      characterAtWorldStore.set(characterId, {
        ...characterAtWorld,
        movesTo: coordinates
      });

      const distance = computeDistance(
        {
          latitude: characterAtWorld.coordinates.lat,
          longitude: characterAtWorld.coordinates.lng
        },
        { latitude: coordinates.lat, longitude: coordinates.lng },
        DISTANCE_ACCURACY
      );

      const duration = distance / characterAtWorld.stats.speed;

      npcSocket.emit(NogEvent.MOVE_NPC_AT_WORLD, {
        coordinates,
        characterId,
        duration,
        distance
      });
    }
  );
};

export const handleNpcGeneration = (
  characterAtWorld: CharacterAtWorld,
  charactersInSightNumber: number
) => {
  try {
    characterAtWorldSchema.validateSync(characterAtWorld);
    numberSchema.validateSync(charactersInSightNumber);
  } catch (error) {
    logger.error(error, 'Error during handling NPC generation');
    return;
  }

  /** Comment for the stress test */
  if (characterAtWorld.isNpc) {
    return;
  }
  /** */

  if (
    charactersInSightNumber < NPC_GENERATION_THRESHOLD &&
    Math.random() < NPC_GENERATION_CHANCE_PER_TICK
  ) {
    const npcSocket = getNpcSocket();

    if (npcSocket) {
      npcSocket.emit(NogEvent.CREATE_NPC, {
        coordinates: characterAtWorld.coordinates,
        sightRange: characterAtWorld.stats.sightRange
      });
    }
  }
};
