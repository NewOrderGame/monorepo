import { getCenter as computeCenter, getDistance as getDistance } from 'geolib';
import { DISTANCE_ACCURACY, ENCOUNTER_COOL_DOWN_TIME, ENCOUNTER_DISTANCE } from '../lib/constants';
import sessionStore from '../store/session-store';
import * as moment from 'moment';
import logger from '../lib/logger';
import { nanoid } from 'nanoid';
import { NogEvent, Page } from '@newordergame/common';
import characterStore from '../store/character-store';
import encounterStore from '../store/encounter-store';
import { getWorld } from '../namespaces/world-namespace';
import { Namespace } from 'socket.io';

export function handleCharactersEncounter(
  characterIdA: string,
  characterIdB: string,
  world: Namespace
) {
  const characterA = characterStore.get(characterIdA);
  const characterB = characterStore.get(characterIdB);

  if (!characterA || !characterB) {
    return;
  }

  if (characterA.characterId === characterB.characterId) {
    return;
  }

  const distance = getDistance(
    {
      latitude: characterA.coordinates.lat,
      longitude: characterA.coordinates.lng
    },
    {
      latitude: characterB.coordinates.lat,
      longitude: characterB.coordinates.lng
    },
    DISTANCE_ACCURACY
  );

  const sessionA = sessionStore.get(characterA.characterId);
  const sessionB = sessionStore.get(characterB.characterId);

  let canEncounter: boolean =
    !sessionA.encounterStartTime && !sessionB.encounterStartTime;

  if (sessionA.encounterEndTime) {
    const now = moment().valueOf();
    canEncounter =
      canEncounter &&
      moment(sessionA.encounterEndTime)
        .add(ENCOUNTER_COOL_DOWN_TIME, 'second')
        .diff(now) <= 0;
  }

  if (canEncounter && sessionA.encounterEndTime) {
    sessionA.encounterEndTime = null;
    sessionStore.set(sessionA.sessionId, {
      ...sessionA
    });
  }

  if (distance <= ENCOUNTER_DISTANCE && canEncounter) {
    logger.info('Encounter', {
      characterA: {
        characterId: characterA.characterId,
        nickname: characterA.nickname
      },
      characterB: {
        characterId: characterB.characterId,
        nickname: characterB.nickname
      }
    });
    const center = computeCenter([
      characterA.coordinates,
      characterB.coordinates
    ]);

    if (center) {
      const encounterId = nanoid();
      const centerCoordinates = {
        lat: center.latitude,
        lng: center.longitude
      };

      const encounterStartTime = moment().valueOf();

      sessionA.page = Page.ENCOUNTER;
      sessionA.encounterId = encounterId;
      sessionA.coordinates = centerCoordinates;
      sessionA.encounterStartTime = encounterStartTime;
      sessionStore.set(sessionA.sessionId, { ...sessionA });

      sessionB.page = Page.ENCOUNTER;
      sessionB.encounterId = encounterId;
      sessionB.coordinates = centerCoordinates;
      sessionB.encounterStartTime = encounterStartTime;
      sessionStore.set(sessionB.sessionId, { ...sessionB });

      characterStore.delete(characterA.characterId);
      characterStore.delete(characterB.characterId);

      encounterStore.set(encounterId, {
        encounterId,
        encounterStartTime: encounterStartTime,
        coordinates: centerCoordinates,
        participants: [
          {
            characterId: characterA.characterId,
            nickname: characterA.nickname
          },
          {
            characterId: characterB.characterId,
            nickname: characterB.nickname
          }
        ]
      });

      world
        .to(characterA.characterId)
        .emit(NogEvent.REDIRECT, { page: Page.ENCOUNTER });
      world
        .to(characterB.characterId)
        .emit(NogEvent.REDIRECT, { page: Page.ENCOUNTER });
    } else {
      logger.error('Something is wrong with a center');
    }
  }
}
