import { io } from 'socket.io-client';
import logger from './lib/utils/logger';
import {
  CharacterAtWorld,
  CharacterInSight,
  Coordinates,
  NogEvent
} from '@newordergame/common';
import characterAtWorldStore from './store/character-at-world-store';
import { getRandomHouseEntryCoordinates } from './lib/overpass';

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
  characterAtWorldStore.clear();
  logger.info('Disconnected');
});

game.on(NogEvent.CONNECTED, () => {
  logger.info('Connected to Game namespace');
});

game.on(NogEvent.INIT_NPC, (npcList: CharacterAtWorld[]) => {
  logger.info(
    npcList.map((npc) => npc.characterId),
    'Init NPC'
  );
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

game.on(
  NogEvent.MOVE_NPC_AT_WORLD,
  (event: {
    characterId: string;
    coordinates: Coordinates;
    duration: number;
    distance: number;
  }) => {
    const characterAtWorld = characterAtWorldStore.get(event.characterId);
    characterAtWorldStore.set(event.characterId, {
      ...characterAtWorld,
      movesTo: event.coordinates
    });

    setTimeout(() => {
      characterAtWorldStore.set(event.characterId, {
        ...characterAtWorld,
        movesTo: null
      });
      game.emit(NogEvent.DESTROY_NPC, [characterAtWorld.characterId]);
    }, event.duration * 1000 + 1000);
  }
);

game.on(
  NogEvent.CREATE_NPC,
  async (event: { coordinates: Coordinates; sightRange: number }) => {
    logger.debug({ coordinates: event.coordinates }, 'create-npc');

    const spawnCoordinates = await getRandomHouseEntryCoordinates(
      event.coordinates,
      event.sightRange
    );

    game.emit('create-npc', spawnCoordinates);
  }
);

/** NPC ENGINE */
setInterval(() => {
  const characters = characterAtWorldStore.getAll();

  characters.forEach((character) => {
    // let friends: CharacterInSight[] = character.charactersInSight.filter(
    //   (c) => !c.isEnemy
    // );
    // let enemies: CharacterInSight[] = character.charactersInSight.filter(
    //   (c) => c.isEnemy
    // );
    // character.charactersInSight.forEach((characterInSight) => {});

    if (!character.movesTo) {
      getRandomHouseEntryCoordinates(
        character.coordinates,
        character.stats.sightRange * 3
      ).then((coordinates) => {
        game.emit(NogEvent.MOVE_NPC_AT_WORLD, {
          coordinates,
          characterId: character.characterId
        });
      });
    }
  });
}, 1000);
/** */

logger.info('Game connected');
