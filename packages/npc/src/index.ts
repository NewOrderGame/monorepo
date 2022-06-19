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

const game = io(`${CORE_URL}/game`, {
  autoConnect: false
});

game.auth = { npcServiceSecret: 'NPC_SERVICE_SECRET' };

logger.debug('Connecting to Game...');
game.connect();

game.on(NogEvent.CONNECT, () => {
  logger.info('Connecting...');
});

game.on(NogEvent.DISCONNECT, () => {
  logger.info('Disconnected');
});

game.on(NogEvent.CONNECTED, () => {
  logger.info('Connected to Game namespace');
});

game.on(NogEvent.INIT_NPC, (npcList: CharacterAtWorld[]) => {
  npcList.forEach((npc) => {
    characterAtWorldStore.set(npc.characterId, npc);
  });
});

game.on(NogEvent.DESTROY_NPC, (npcList: CharacterAtWorld[]) => {
  npcList.forEach((npc) => {
    characterAtWorldStore.delete(npc.characterId);
  });
});

game.on(
  NogEvent.CHARACTERS_IN_SIGHT,
  (event: { characterId: string; charactersInSight: CharacterInSight[] }) => {
    const character = characterAtWorldStore.get(event.characterId);
    characterAtWorldStore.set(event.characterId, {
      ...character,
      charactersInSight: event.charactersInSight
    });
  }
);

/** NPC ENGINE */
setInterval(() => {
  const characters = characterAtWorldStore.getAll();

  characters.forEach((character) => {
    let friends: CharacterInSight[];
    let enemies: CharacterInSight[];

    character.charactersInSight.forEach((characterInSight) => {
      logger.debug(
        {
          characterInSight: characterInSight.nickname,
          isEnemy: characterInSight.isEnemy
        },
        character.characterId
      );
    });
  });
}, 1000);
/** */

logger.info('Game connected');
