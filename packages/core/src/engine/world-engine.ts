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

const doNextTick = (gameNamespace: Namespace) => {
  const charactersAtWorld: CharacterAtWorld[] = characterAtWorldStore.getAll();
  const encounters: Encounter[] = encounterStore.getAll();

  const charactersInSight: Map<NogCharacterId, CharacterInSight[]> = new Map();
  const encountersInSight: Map<NogCharacterId, EncounterInSight[]> = new Map();

  for (let cA = 0; cA < charactersAtWorld.length; cA += 1) {
    const characterAtWorldA = charactersAtWorld[cA];

    /** Encounter visibility */
    encountersInSight.set(characterAtWorldA.characterId, []);

    for (const encounter of encounters) {
      checkEncounterVisibility(
        characterAtWorldA.characterId,
        encounter.encounterId,
        encountersInSight.get(characterAtWorldA.characterId)
      );
    }
    /** */

    /** Character visibility and encounter */
    if (!charactersInSight.has(characterAtWorldA.characterId)) {
      charactersInSight.set(characterAtWorldA.characterId, []);
    }

    for (let cB = cA + 1; cB < charactersAtWorld.length; cB += 1) {
      const characterAtWorldB = charactersAtWorld[cB];

      if (!charactersInSight.has(characterAtWorldB.characterId)) {
        charactersInSight.set(characterAtWorldB.characterId, []);
      }
      checkCharacterVisibility(
        characterAtWorldA.characterId,
        characterAtWorldB.characterId,
        charactersInSight.get(characterAtWorldA.characterId),
        charactersInSight.get(characterAtWorldB.characterId)
      );
      handleCharactersEncounter(
        characterAtWorldA.characterId,
        characterAtWorldB.characterId,
        gameNamespace
      );
    }
    /** */

    /** NPC */
    handleNpcGeneration(
      characterAtWorldA,
      charactersInSight.get(characterAtWorldA.characterId)?.length
    );
    /** */

    /** Movement */
    moveCharacter(characterAtWorldA.characterId);
    /** */

    /** Send visible objects */
    sendCharactersInSight(
      characterAtWorldA.characterId,
      charactersInSight.get(characterAtWorldA.characterId),
      gameNamespace
    );
    sendEncountersInSight(
      characterAtWorldA.characterId,
      encountersInSight.get(characterAtWorldA.characterId),
      gameNamespace
    );
    /** */
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
