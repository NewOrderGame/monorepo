import { CharacterInSight, EncounterInSight } from '@newordergame/common';
import { SPEED_MULTIPLIER } from '../utils/constants';
import characterStore from '../store/character-store';
import encounterStore from '../store/encounter-store';
import * as moment from 'moment';
import { moveCharacter } from './movement';
import {
  checkCharacterVisibility,
  checkEncounterVisibility,
  sendCharactersInSight,
  sendEncountersInSight
} from './visibility';
import { handleCharactersEncounter } from './encounter';

let timer: NodeJS.Timer;

export function runWorld() {
  timer = setInterval(() => {
    const currentTick = moment().valueOf();

    characterStore.forEach((characterA, characterIdA) => {
      const charactersInSight: CharacterInSight[] = [];
      const encountersInSight: EncounterInSight[] = [];

      encounterStore.forEach((encounter) => {
        checkEncounterVisibility(characterA, encounter, encountersInSight);
      });

      characterStore.forEach((characterB, characterIdB) => {
        if (characterIdA !== characterIdB) {
          checkCharacterVisibility(characterA, characterB, charactersInSight);
          handleCharactersEncounter(characterA, characterB, currentTick);
        }
      });

      moveCharacter(characterA);

      sendCharactersInSight(characterA, charactersInSight);

      sendEncountersInSight(characterA, encountersInSight);
    });
  }, 1000 / SPEED_MULTIPLIER);
}

export function stopWorld() {
  clearInterval(timer);
}
