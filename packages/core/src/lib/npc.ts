import {
  CharacterAtWorld,
  Coordinates,
  NogCharacterId,
  NogEvent,
  NogPage
} from '@newordergame/common';
import {
  NPC_GENERATION_CHANCE_PER_TICK,
  NPC_GENERATION_THRESHOLD
} from './utils/constants';
import { computeDestinationPoint as computeDestination } from 'geolib';
import { createCharacterAtWorld } from './character-at-world';
import { nanoid } from 'nanoid';
import characterAtWorldStore from '../store/character-at-world-store';
import { Socket } from 'socket.io';
import logger from './utils/logger';
import { getNpcSocket, setNpcSocket } from '../store/npc-socket-store';

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
    const npc = createCharacterAtWorld({
      character: {
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
      },
      isNpc: true
    });

    characterAtWorldStore.set(npc.characterId, npc);
  });
};

export const handleNpcGeneration = (
  characterAtWorld: CharacterAtWorld,
  charactersInSightNumber: number
) => {
  if (charactersInSightNumber < NPC_GENERATION_THRESHOLD) {
    const npcSocket = getNpcSocket();

    if (npcSocket) {
      npcSocket.emit('create-npc', {
        coordinates: characterAtWorld.coordinates,
        sightRange: characterAtWorld.stats.sightRange
      });
    }
  }
};
