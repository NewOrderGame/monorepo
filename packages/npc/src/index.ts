import { io } from 'socket.io-client';
import logger from './lib/logger';
import {
  CharacterAtWorld,
  CharacterInSight,
  NogEvent
} from '@newordergame/common';
import characterAtWorldStore from './store/character-at-world-store';

if (!process.env.NOG_CORE_URL) {
  throw new Error('Environment variable NOG_CORE_URL is missing');
}
const CORE_URL = process.env.NOG_CORE_URL;

const auth = io(`${CORE_URL}/auth`, {
  autoConnect: false
});

auth.auth = { npcServiceSecret: 'NPC_SERVICE_SECRET' };

logger.debug('Connecting to Auth...');
auth.connect();

auth.on(NogEvent.INIT, (npcList: CharacterAtWorld[]) => {
  npcList.forEach((npc) => {
    characterAtWorldStore.set(npc.characterId, npc);
    logger.debug('npc', { npc });
  });
});

auth.on(NogEvent.DESTROY, (npcList: CharacterAtWorld[]) => {
  npcList.forEach((npc) => {
    characterAtWorldStore.delete(npc.characterId);
  });
});

logger.info('Auth connected');

/** */

const world = io(`${CORE_URL}/world`, {
  autoConnect: false
});

world.on(
  NogEvent.CHARACTERS_IN_SIGHT,
  ({
     characterId,
     charactersInSight
   }: {
    characterId: string;
    charactersInSight: CharacterInSight[];
  }) => {
    const character = characterAtWorldStore.get(characterId);
    characterAtWorldStore.set(characterId, {
      ...character,
      charactersInSight: charactersInSight
    });
  }
);


world.auth = { npcServiceSecret: 'NPC_SERVICE_SECRET' };

logger.debug('Connecting to World...');
world.connect();
