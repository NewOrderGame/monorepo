import { io } from 'socket.io-client';
import logger from './lib/utils/logger';
import {
  CharacterAtWorld,
  characterIdSchema,
  CharacterInSight,
  Coordinates,
  coordinatesSchema,
  NogEvent,
  numberSchema
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

logger.info('Connecting to Game...');
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
      charactersInSight
    });
  }
);

game.on(
  NogEvent.MOVE_NPC_AT_WORLD,
  ({
    characterId,
    coordinates,
    duration,
    distance
  }: {
    characterId: string;
    coordinates: Coordinates;
    duration: number;
    distance: number;
  }) => {
    logger.info(
      { characterId, coordinates, duration, distance },
      'Move NPC at world'
    );

    try {
      characterIdSchema.validateSync(characterId);
      coordinatesSchema.validateSync(coordinates);
      numberSchema.validateSync(duration);
      numberSchema.validateSync(distance);
    } catch (error) {
      logger.error(error, 'Error during moving NPC at world');
      return;
    }

    const characterAtWorld = characterAtWorldStore.get(characterId);
    characterAtWorldStore.set(characterId, {
      ...characterAtWorld,
      movesTo: coordinates
    });

    setTimeout(() => {
      characterAtWorldStore.set(characterId, {
        ...characterAtWorld,
        movesTo: null
      });
      /** Comment for the stress test */
      game.emit(NogEvent.DESTROY_NPC, [characterAtWorld.characterId]);
      /** */
    }, duration * 1000 + 1000);
  }
);

game.on(
  NogEvent.CREATE_NPC,
  async ({
    coordinates,
    sightRange
  }: {
    coordinates: Coordinates;
    sightRange: number;
  }) => {
    logger.info({ coordinates }, 'Create NPC');

    try {
      coordinatesSchema.validateSync(coordinates);
    } catch (error) {
      logger.error(error, 'Error during creating NPC');
      return;
    }

    let spawnCoordinates: Coordinates;
    try {
      spawnCoordinates = await getRandomHouseEntryCoordinates(
        coordinates,
        sightRange
      );
    } catch (error) {
      logger.error(
        error,
        'Error during creating NPC, getting random house entry coordinates'
      );
    }

    game.emit(NogEvent.CREATE_NPC, spawnCoordinates);
  }
);

/** NPC ENGINE */
setInterval(() => {
  const characters = characterAtWorldStore.getAll();

  characters.forEach((character) => {
    if (!character.movesTo) {
      getRandomHouseEntryCoordinates(
        character.coordinates,
        character.stats.sightRange * 3
      )
        .then((coordinates) => {
          game.emit(NogEvent.MOVE_NPC_AT_WORLD, {
            coordinates,
            characterId: character.characterId
          });
        })
        .catch((error) => {
          logger.error(error, 'Error during moving NPC');
        });
    }
  });
}, 1000);
/** */
