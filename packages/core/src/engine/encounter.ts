import { getCenter as computeCenter, getDistance as getDistance } from 'geolib';
import {
  DISTANCE_ACCURACY,
  ENCOUNTER_COOL_DOWN_TIME,
  ENCOUNTER_DISTANCE
} from '../lib/constants';
import characterStore from '../store/character-store';
import * as moment from 'moment';
import logger from '../lib/logger';
import { nanoid } from 'nanoid';
import {
  NogEvent,
  NogPage,
  NogCharacterId,
  NogEncounterId
} from '@newordergame/common';
import characterAtWorldStore from '../store/character-at-world-store';
import encounterStore from '../store/encounter-store';
import { Namespace } from 'socket.io';

export function handleCharactersEncounter(
  characterIdA: NogCharacterId,
  characterIdB: NogCharacterId,
  world: Namespace
) {
  const characterAtWorldA = characterAtWorldStore.get(characterIdA);
  const characterAtWorldB = characterAtWorldStore.get(characterIdB);

  if (!characterAtWorldA || !characterAtWorldB) {
    return;
  }

  if (characterAtWorldA.characterId === characterAtWorldB.characterId) {
    return;
  }

  const distance = getDistance(
    {
      latitude: characterAtWorldA.coordinates.lat,
      longitude: characterAtWorldA.coordinates.lng
    },
    {
      latitude: characterAtWorldB.coordinates.lat,
      longitude: characterAtWorldB.coordinates.lng
    },
    DISTANCE_ACCURACY
  );

  const characterA = characterStore.get(characterAtWorldA.characterId);
  const characterB = characterStore.get(characterAtWorldB.characterId);

  let canEncounter: boolean =
    !characterA.encounterStartTime && !characterB.encounterStartTime;

  if (characterA.encounterEndTime) {
    const now = moment().valueOf();
    canEncounter =
      canEncounter &&
      moment(characterA.encounterEndTime)
        .add(ENCOUNTER_COOL_DOWN_TIME, 'second')
        .diff(now) <= 0;
  }

  if (canEncounter && characterA.encounterEndTime) {
    characterA.encounterEndTime = null;
    characterStore.set(characterA.characterId, {
      ...characterA
    });
  }

  if (distance <= ENCOUNTER_DISTANCE && canEncounter) {
    logger.info('Encounter', {
      characterAtWorldA: {
        characterId: characterAtWorldA.characterId,
        nickname: characterAtWorldA.nickname
      },
      characterAtWorldB: {
        characterId: characterAtWorldB.characterId,
        nickname: characterAtWorldB.nickname
      }
    });
    const center = computeCenter([
      characterAtWorldA.coordinates,
      characterAtWorldB.coordinates
    ]);

    if (center) {
      const encounterId: NogEncounterId = nanoid();
      const centerCoordinates = {
        lat: center.latitude,
        lng: center.longitude
      };

      const encounterStartTime = moment().valueOf();

      characterA.page = NogPage.ENCOUNTER;
      characterA.encounterId = encounterId;
      characterA.coordinates = centerCoordinates;
      characterA.encounterStartTime = encounterStartTime;
      characterStore.set(characterA.characterId, { ...characterA });

      characterB.page = NogPage.ENCOUNTER;
      characterB.encounterId = encounterId;
      characterB.coordinates = centerCoordinates;
      characterB.encounterStartTime = encounterStartTime;
      characterStore.set(characterB.characterId, { ...characterB });

      characterAtWorldStore.delete(characterAtWorldA.characterId);
      characterAtWorldStore.delete(characterAtWorldB.characterId);

      encounterStore.set(encounterId, {
        encounterId,
        encounterStartTime,
        coordinates: centerCoordinates,
        participants: [
          {
            characterId: characterAtWorldA.characterId,
            nickname: characterAtWorldA.nickname
          },
          {
            characterId: characterAtWorldB.characterId,
            nickname: characterAtWorldB.nickname
          }
        ]
      });

      world
        .to(characterAtWorldA.characterId)
        .emit(NogEvent.REDIRECT, { page: NogPage.ENCOUNTER });
      world
        .to(characterAtWorldB.characterId)
        .emit(NogEvent.REDIRECT, { page: NogPage.ENCOUNTER });
    } else {
      logger.error('Something is wrong with a center');
    }
  }
}
