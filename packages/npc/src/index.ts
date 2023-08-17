import { io } from 'socket.io-client';
import logger from './lib/utils/logger';
import {
  CharacterAtWorld,
  characterIdSchema,
  CharacterInSight,
  Coordinates,
  coordinatesSchema,
  NogCharacterId,
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

game.auth = { npcServiceSecret: process.env.NOG_NPC_SERVICE_SECRET };

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

const npcListToDestroy = new Map<
  NogCharacterId,
  CharacterAtWorld & { timeout: NodeJS.Timeout }
>();

game.on(NogEvent.INIT_NPC, (npcList: CharacterAtWorld[]) => {
  logger.info(
    npcList.map((npc) => npc.characterId),
    'Init NPC'
  );
  npcList.forEach((npc) => {
    characterAtWorldStore.set(npc.characterId, npc);
    const timeout = setTimeout(() => {
      game.emit(NogEvent.DESTROY_NPC, [npc.characterId]);
    }, 10000);

    npcListToDestroy.set(npc.characterId, { ...npc, timeout });
  });
});

game.on(NogEvent.DESTROY_NPC, (npcList: CharacterAtWorld[]) => {
  npcList.forEach((npc) => {
    characterAtWorldStore.delete(npc.characterId);
    const timeout = npcListToDestroy.get(npc.characterId)?.timeout;
    if (timeout) {
      clearTimeout(timeout);
    }
    npcListToDestroy.delete(npc.characterId);
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

    if (!character) {
      logger.error('Character not found');
      return;
    }

    characterAtWorldStore.set(characterId, {
      ...character,
      charactersInSight
    });
  }
);

type MoveAtWorldType = {
  characterId: string;
  coordinates: Coordinates;
  duration: number;
  distance: number;
};

game.on(
  NogEvent.MOVE_NPC_AT_WORLD,
  ({ characterId, coordinates, duration, distance }: MoveAtWorldType) => {
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
      logger.error(
        error,
        'Error during moving NPC at world during MOVE_NPC_AT_WORLD'
      );
      return;
    }

    const characterAtWorld = characterAtWorldStore.get(characterId);

    if (!characterAtWorld) {
      logger.error('Character at world not found');
      return;
    }

    characterAtWorldStore.set(characterId, {
      ...characterAtWorld,
      movesTo: coordinates
    });
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
      return;
    }

    game.emit(NogEvent.CREATE_NPC, spawnCoordinates);
  }
);

/** NPC ENGINE */
setInterval(() => {
  const characters = characterAtWorldStore.getAll();

  characters.forEach((character) => {
    const enemies: CharacterInSight[] = character.charactersInSight.filter(
      (characterInSight) => characterInSight.isEnemy
    );

    if (enemies.length) {
      const closest: CharacterInSight = enemies.reduce((pEnemy, cEnemy) => {
        return pEnemy.distance < cEnemy.distance ? pEnemy : cEnemy;
      });

      game.emit(NogEvent.MOVE_NPC_AT_WORLD, {
        coordinates: closest.coordinates,
        characterId: character.characterId
      });
      return;
    }

    if (!character.movesTo) {
      getRandomHouseEntryCoordinates(
        character.coordinates,
        character.stats.sightRange * 3
      )
        .then((coordinates) =>
          game.emit(NogEvent.MOVE_NPC_AT_WORLD, {
            coordinates,
            characterId: character.characterId
          })
        )
        .catch((error) => {
          logger.error(error, 'Error during moving NPC');
        });
    }
  });
}, 1000);
