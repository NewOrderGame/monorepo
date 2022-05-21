import { getCenter, getDistance as computeDistance } from 'geolib';
import { DISTANCE_ACCURACY, ENCOUNTER_DISTANCE } from '../utils/constants';
import sessionStore from '../store/session-store';
import * as moment from 'moment';
import logger from '../utils/logger';
import { nanoid } from 'nanoid';
import { Character, NogEvent, Page } from '@newordergame/common';
import characterStore from '../store/character-store';
import encounterStore from '../store/encounter-store';
import { getWorld } from '../namespaces/world-namespace';

export function handleCharactersEncounter(
  characterA: Character,
  characterB: Character,
  currentTick: number
) {
  if (characterA.characterId === characterB.characterId) {
    return;
  }

  const distance = computeDistance(
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
    (!sessionA.encounterStartTime && !sessionB.encounterStartTime) ||
    sessionB.encounterStartTime === currentTick;

  if (sessionA.encounterEndTime) {
    const now = moment().valueOf();
    canEncounter =
      canEncounter &&
      moment(sessionA.encounterEndTime).add(5, 'second').diff(now) <= 0;
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
    const center = getCenter([characterA.coordinates, characterB.coordinates]);

    if (center) {
      const encounterId = nanoid();
      const centerCoordinates = {
        lat: center.latitude,
        lng: center.longitude
      };

      const sessionIdA = characterA.socket.data.sessionId;
      const sessionA = sessionStore.get(sessionIdA);
      sessionA.page = Page.ENCOUNTER;
      sessionA.encounterId = encounterId;
      sessionA.coordinates = centerCoordinates;
      sessionA.encounterStartTime = currentTick;
      sessionStore.set(sessionIdA, { ...sessionA });

      const sessionIdB = characterB.socket.data.sessionId;
      const sessionB = sessionStore.get(sessionIdB);
      sessionB.page = Page.ENCOUNTER;
      sessionB.encounterId = encounterId;
      sessionB.coordinates = centerCoordinates;
      sessionB.encounterStartTime = currentTick;
      sessionStore.set(sessionIdB, { ...sessionB });

      characterStore.delete(characterA.characterId);
      characterStore.delete(characterB.characterId);

      encounterStore.set(encounterId, {
        encounterId,
        encounterStartTime: currentTick,
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

      getWorld()
        .to(characterA.characterId)
        .emit(NogEvent.REDIRECT, { page: Page.ENCOUNTER });

      getWorld()
        .to(characterB.characterId)
        .emit(NogEvent.REDIRECT, { page: Page.ENCOUNTER });
    } else {
      logger.error('Something is wrong with a center');
    }
  }
}
