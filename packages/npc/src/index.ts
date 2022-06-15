import { io } from 'socket.io-client';
import logger from './lib/logger';
import { CharacterAtWorld, NogEvent } from '@newordergame/common';
import characterAtWorldStore from './store/character-at-world-store';

if (!process.env.NOG_CORE_URL) {
  throw new Error('Environment variable NOG_CORE_URL is missing');
}
const CORE_URL = process.env.NOG_CORE_URL;

const auth = io(`${CORE_URL}/auth`, {
  autoConnect: false
});
auth.auth = { npcServiceSecret: 'NPC_SERVICE_SECRET' };
auth.connect();
auth.on(NogEvent.INIT, (npcList: CharacterAtWorld[]) => {
  npcList.forEach((npc) => {
    characterAtWorldStore.set(npc.characterId, npc);
  });
});

auth.on(NogEvent.DESTROY, (npcList: CharacterAtWorld[]) => {
  npcList.forEach((npc) => {
    characterAtWorldStore.delete(npc.characterId);
  });
});

logger.info('Auth connected');
