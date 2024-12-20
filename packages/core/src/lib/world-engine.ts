import {
  logger,
  CharacterAtWorld,
  CharacterInSight,
  Encounter,
  EncounterInSight,
  NogCharacterId
} from '@newordergame/common';
import { SECOND, TICK_PER_SECOND } from './constants';
import characterAtWorldStore from './store/character-at-world-store';
import encounterStore from './store/encounter-store';
import {
  checkCharacterVisibility,
  checkEncounterVisibility,
  moveCharacter,
  sendCharactersInSight,
  sendEncountersInSight
} from './world';
import { argv } from './argv';
import { withStats } from '../stats/writer';
import { StatsGroups } from './types';
import { Namespace } from 'socket.io';
import {
  handleCharacterJoinEncounter,
  handleCharactersEncounter
} from './encounter';

const doNextTick = (gameNamespace: Namespace) => {
  const charactersAtWorld: CharacterAtWorld[] = characterAtWorldStore.getAll();
  const encounters: Encounter[] = encounterStore.getAll();

  const charactersInSight: Map<NogCharacterId, CharacterInSight[]> = new Map();
  const encountersInSight: Map<NogCharacterId, EncounterInSight[]> = new Map();

  // Pre-process charactersInSight map
  charactersAtWorld.forEach((characterAtWorld) => {
    charactersInSight.set(characterAtWorld.characterId, []);
  });

  for (let cA = 0; cA < charactersAtWorld.length; cA += 1) {
    const characterAtWorldA: CharacterAtWorld = charactersAtWorld[cA];

    // Encounter visibility
    encountersInSight.set(characterAtWorldA.characterId, []);

    const encounterInSight = encountersInSight.get(
      characterAtWorldA.characterId
    );

    if (!encounterInSight) {
      logger.error('Encouters in sight not found');
      return;
    }

    for (const encounter of encounters) {
      checkEncounterVisibility(
        characterAtWorldA.characterId,
        encounter.encounterId,
        encounterInSight
      );
      handleCharacterJoinEncounter(
        characterAtWorldA.characterId,
        encounter.encounterId,
        gameNamespace
      );
    }

    const characterInSightA = charactersInSight.get(
      characterAtWorldA.characterId
    );

    if (!characterInSightA) {
      logger.error('Encouters in sight not found');
      return;
    }

    // Character visibility and encounter
    for (let cB = cA + 1; cB < charactersAtWorld.length; cB += 1) {
      const characterAtWorldB = charactersAtWorld[cB];

      const characterInSightB = charactersInSight.get(
        characterAtWorldB.characterId
      );
      if (!characterInSightB) {
        logger.error('Encouters in sight not found');
        return;
      }

      checkCharacterVisibility(
        characterAtWorldA.characterId,
        characterAtWorldB.characterId,
        characterInSightA,
        characterInSightB
      );
      handleCharactersEncounter(
        characterAtWorldA.characterId,
        characterAtWorldB.characterId
      );
    }

    {
      const characterInSight = charactersInSight.get(
        characterAtWorldA.characterId
      );
      if (!characterInSight) {
        logger.error('Character in sight not found');
        return;
      }
    }

    // Movement
    {
      moveCharacter(characterAtWorldA.characterId);
    }

    // Send visible objects
    {
      const characterInSight = charactersInSight.get(
        characterAtWorldA.characterId
      );
      if (!characterInSight) {
        logger.error('Character in sight not found');
        return;
      }

      sendCharactersInSight(
        characterAtWorldA.characterId,
        characterInSight,
        gameNamespace
      );

      const encounterInSight = encountersInSight.get(
        characterAtWorldA.characterId
      );
      if (!encounterInSight) {
        logger.error('Encouters in sight not found');
        return;
      }

      sendEncountersInSight(
        characterAtWorldA.characterId,
        encounterInSight,
        gameNamespace
      );
    }
  }
};

const defineDoNextTick = (gameNamespace: Namespace) => {
  if (argv.s || argv.stats) {
    return withStats(() => doNextTick(gameNamespace), StatsGroups.TICK);
  } else {
    return () => doNextTick(gameNamespace);
  }
};

export const startGame = (gameNamespace: Namespace): NodeJS.Timer => {
  return setInterval(defineDoNextTick(gameNamespace), SECOND / TICK_PER_SECOND);
};
