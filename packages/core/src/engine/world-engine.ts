import {
  CharacterAtWorld,
  CharacterInSight,
  Encounter,
  EncounterInSight,
  NogCharacterId
} from '@newordergame/common';
import { SECOND, TICK_PER_SECOND } from '../lib/utils/constants';
import characterAtWorldStore from '../store/character-at-world-store';
import encounterStore from '../store/encounter-store';
import {
  checkCharacterVisibility,
  checkEncounterVisibility,
  moveCharacter,
  sendCharactersInSight,
  sendEncountersInSight
} from '../lib/world';
import { argv } from '../lib/utils/argv';
import { withStats } from '../stats/writer';
import { StatsGroups } from '../lib/utils/types';
import { Namespace } from 'socket.io';
import { handleNpcGeneration } from '../lib/npc';
import { handleCharactersEncounter } from '../lib/encounter';
import logger from '../lib/utils/logger';

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
        characterAtWorldB.characterId,
        gameNamespace
      );
    }

    // NPC
    {
      const characterInSight = charactersInSight.get(
        characterAtWorldA.characterId
      );
      if (!characterInSight) {
        logger.error('Character in sight not found');
        return;
      }

      handleNpcGeneration(characterAtWorldA, characterInSight.length);
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
