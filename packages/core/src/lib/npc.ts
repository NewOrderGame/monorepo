import {
  CharacterAtWorld,
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
import { Namespace, Socket } from 'socket.io';
import logger from './utils/logger';
import npcSocketStore from '../store/npc-socket-store';


export const handleNpcServiceWorldConnection = (
  socket: Socket,
  worldNamespace: Namespace
) => {
  const isNpcService =
    socket.handshake.auth.npcServiceSecret === 'NPC_SERVICE_SECRET';

  if (!isNpcService) {
    return;
  }

  logger.info('NPC service connected to World');
};

export const handleNpcServiceAuthConnection = (
  socket: Socket,
  authNamespace: Namespace
) => {
  const isNpcService =
    socket.handshake.auth.npcServiceSecret === 'NPC_SERVICE_SECRET';

  if (!isNpcService) {
    return;
  }

  logger.info('NPC service connected to Auth');
  const allNpc = characterAtWorldStore.getAllNpc();
  npcSocketStore.set(authNamespace.name, socket);
  socket.emit(NogEvent.INIT, allNpc);
};

export const handleNpcGeneration = (
  characterAtWorld: CharacterAtWorld,
  charactersInSightNumber: number
) => {
  if (
    charactersInSightNumber < NPC_GENERATION_THRESHOLD &&
    Math.random() < NPC_GENERATION_CHANCE_PER_TICK
  ) {
    const angle = Math.random() * 360;
    const distance = Math.random() * characterAtWorld.stats.sightRange;

    const npcCoordinates = computeDestination(
      characterAtWorld.coordinates,
      distance,
      angle
    );

    const npc = createCharacterAtWorld({
      character: {
        characterId: `NPC-${nanoid()}` as NogCharacterId,
        nickname: nanoid(),
        coordinates: {
          lat: npcCoordinates.latitude,
          lng: npcCoordinates.longitude
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

    const npcAuthSocket = npcSocketStore.get('/auth');

    if (npcAuthSocket) {
      npcAuthSocket.emit(NogEvent.INIT, [npc]);
    }
  }
};
