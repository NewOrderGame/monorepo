import {
  Character,
  CharacterAtWorld,
  Coordinates,
  NogCharacterId,
  NogEvent,
  NogPage
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
import logger from './utils/logger';
import { getNpcSocket, setNpcSocket } from '../store/npc-socket-store';
import characterStore from '../store/character-store';
import { getDistance as computeDistance } from 'geolib';

export const handleNpcServiceConnection = (socket: Socket) => {
  const isNpcService =
    socket.handshake.auth.npcServiceSecret === 'NPC_SERVICE_SECRET';

  if (!isNpcService) {
    return;
  }

  logger.info('NPC service connected');
  const allNpc = characterAtWorldStore.getAllNpc();
  setNpcSocket(socket);
  socket.emit(NogEvent.INIT_NPC, allNpc);
  allNpc.forEach((npc) => socket.join(npc.characterId));

  socket.on('create-npc', (coordinates: Coordinates) => {
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
      page: NogPage.WORLD,
      stats: {
        sightRange: 100,
        speed: 30,
        outlook: [
          Math.random() * 200 - 100,
          Math.random() * 200 - 100,
          Math.random() * 200 - 100
        ]
      }
    };

    const npc = createCharacterAtWorld({
      character: defaultNpc,
      isNpc: true
    });

    characterStore.set(defaultNpc.characterId, defaultNpc);
    characterAtWorldStore.set(npc.characterId, npc);
    socket.emit(NogEvent.INIT_NPC, [npc]);
  });

  socket.on(NogEvent.DESTROY_NPC, (characterIds: string[]) => {
    characterIds.forEach((characterId) => {
      characterStore.delete(characterId);
      characterAtWorldStore.delete(characterId);
      socket.emit(NogEvent.DESTROY_NPC, [{ characterId }]);
    });
  });

  socket.on(
    'move-npc-at-world',
    ({
      coordinates,
      characterId
    }: {
      coordinates: Coordinates;
      characterId: string;
    }) => {
      logger.info({ coordinates, characterId }, 'Move NPC at world');

      const characterAtWorld = characterAtWorldStore.get(characterId);

      if (!characterAtWorld) {
        logger.error(
          new Error('Character at world is missing'),
          'Error during moving NPC at world'
        );
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

      socket.emit('move-npc-at-world', {
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
  if (characterAtWorld.isNpc) {
    return;
  }

  if (
    charactersInSightNumber < NPC_GENERATION_THRESHOLD &&
    Math.random() < NPC_GENERATION_CHANCE_PER_TICK
  ) {
    const npcSocket = getNpcSocket();

    if (npcSocket) {
      npcSocket.emit('create-npc', {
        coordinates: characterAtWorld.coordinates,
        sightRange: characterAtWorld.stats.sightRange
      });
    }
  }
};
