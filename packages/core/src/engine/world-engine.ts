import {
  Character,
  CharacterInSight,
  Encounter,
  EncounterInSight
} from '@newordergame/common';
import { SECOND, SPEED_MULTIPLIER } from '../utils/constants';
import characterStore from '../store/character-store';
import encounterStore from '../store/encounter-store';
import { moveCharacter } from './movement';
import {
  checkCharacterVisibility,
  checkEncounterVisibility,
  sendCharactersInSight,
  sendEncountersInSight
} from './visibility';
import { handleCharactersEncounter } from './encounter';
import { argv } from '../utils/argv';
import { withStats } from '../stats/writer';
import { StatsGroups } from '../utils/types';

function doNextTick() {
  const characters: Character[] = characterStore.getAll();
  const encounters: Encounter[] = encounterStore.getAll();

  const charactersInSight: Map<string, CharacterInSight[]> = new Map();
  const encountersInSight: Map<string, EncounterInSight[]> = new Map();

  for (let cA = 0; cA < characters.length; cA += 1) {
    const characterA = characters[cA];

    /** Encounter visibility */
    encountersInSight.set(characterA.characterId, []);

    for (let e = 0; e < encounters.length; e += 1) {
      const encounter = encounters[e];

      checkEncounterVisibility(
        characterA.characterId,
        encounter.encounterId,
        encountersInSight.get(characterA.characterId)
      );
    }
    /** */

    /** Character visibility and encounter */
    if (!charactersInSight.has(characterA.characterId)) {
      charactersInSight.set(characterA.characterId, []);
    }

    for (let cB = cA + 1; cB < characters.length; cB += 1) {
      const characterB = characters[cB];

      if (!charactersInSight.has(characterB.characterId)) {
        charactersInSight.set(characterB.characterId, []);
      }
      checkCharacterVisibility(
        characterA.characterId,
        characterB.characterId,
        charactersInSight.get(characterA.characterId),
        charactersInSight.get(characterB.characterId)
      );
      handleCharactersEncounter(characterA.characterId, characterB.characterId);
    }
    /** */

    /** Movement */
    moveCharacter(characterA.characterId);
    /** */

    /** Send visible objects */
    sendCharactersInSight(
      characterA.characterId,
      charactersInSight.get(characterA.characterId)
    );
    sendEncountersInSight(
      characterA.characterId,
      encountersInSight.get(characterA.characterId)
    );
    /** */
  }
}

let worldTimer: NodeJS.Timer;

const defineDoNextTick = () => {
  if (argv.s || argv.stats) {
    return withStats(doNextTick, StatsGroups.TICK);
  } else {
    return doNextTick;
  }
};

export function runWorld() {
  worldTimer = setInterval(defineDoNextTick(), SECOND / SPEED_MULTIPLIER);
}

export function stopWorld() {
  clearInterval(worldTimer);
}
