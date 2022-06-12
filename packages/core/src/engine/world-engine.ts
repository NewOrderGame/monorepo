import {
  CharacterAtWorld,
  CharacterInSight,
  Encounter,
  EncounterInSight,
  NogCharacterId
} from '@newordergame/common';
import { SECOND, TICK_PER_SECOND } from '../lib/constants';
import characterAtWorldStore from '../store/character-at-world-store';
import encounterStore from '../store/encounter-store';
import { moveCharacter } from '../lib/movement';
import {
  checkCharacterVisibility,
  checkEncounterVisibility,
  sendCharactersInSight,
  sendEncountersInSight
} from '../lib/visibility';
import { handleCharactersEncounter } from '../lib/encounter';
import { argv } from '../lib/argv';
import { withStats } from '../stats/writer';
import { StatsGroups } from '../lib/types';
import { getWorld } from '../namespaces/world-namespace';
import { Namespace } from 'socket.io';
import { handleNpcGeneration } from '../lib/npc';

function doNextTick(world: Namespace) {
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
        world
      );
    }
    /** */

    /** NPC */
    handleNpcGeneration(
      characterAtWorldA.coordinates,
      characterAtWorldA.stats.sightRange,
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
      world
    );
    sendEncountersInSight(
      characterAtWorldA.characterId,
      encountersInSight.get(characterAtWorldA.characterId),
      world
    );
    /** */
  }
}

let worldTimer: NodeJS.Timer;

const defineDoNextTick = (world: Namespace) => {
  if (argv.s || argv.stats) {
    return withStats(() => doNextTick(world), StatsGroups.TICK);
  } else {
    return () => doNextTick(world);
  }
};

export function runWorld() {
  const world = getWorld();
  worldTimer = setInterval(defineDoNextTick(world), SECOND / TICK_PER_SECOND);
}

export function stopWorld() {
  clearInterval(worldTimer);
}
