import { nanoid } from 'nanoid';
import { CharacterInSight, EncounterInSight, Page } from '@newordergame/common';
import {
  computeDestinationPoint as computeDestination,
  getCenter,
  getDistance as computeDistance,
  getGreatCircleBearing as computeBearing
} from 'geolib';
import { getWorld } from '../namespaces/world-namespace';
import {
  DISTANCE_ACCURACY,
  ENCOUNTER_DISTANCE,
  SPEED_MULTIPLIER
} from '../utils/constants';
import characterStore from '../store/character-store';
import encounterStore from '../store/encounter-store';
import sessionStore from '../store/session-store';
import * as moment from 'moment';
import logger from '../utils/logger';

export function runWorld() {
  setInterval(() => {
    const currentTick = moment().valueOf();

    characterStore.forEach((characterA, characterIdA) => {
      const charactersInSight: CharacterInSight[] = [];
      const encountersInSight: EncounterInSight[] = [];

      encounterStore.forEach((encounter) => {
        const distance = computeDistance(
          {
            latitude: characterA.coordinates.lat,
            longitude: characterA.coordinates.lng
          },
          {
            latitude: encounter.coordinates.lat,
            longitude: encounter.coordinates.lng
          },
          DISTANCE_ACCURACY
        );

        if (distance < characterA.sightRange) {
          encountersInSight.push({
            encounterId: encounter.encounterId,
            coordinates: encounter.coordinates,
            participants: encounter.participants,
            distance
          });

          characterA.encounterSightFlag = true;
          characterStore.set(characterA.characterId, {
            ...characterA
          });
        }
      });

      characterStore.forEach((characterB, characterIdB) => {
        if (characterIdA !== characterIdB) {
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
          if (distance <= characterA.sightRange) {
            charactersInSight.push({
              coordinates: characterB.coordinates,
              characterId: characterB.characterId,
              nickname: characterB.nickname,
              distance
            });

            characterA.characterSightFlag = true;
            characterStore.set(characterA.characterId, {
              ...characterA
            });
          }

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
            logger.info(
              'Encounter: (${characterA.nickname} and ${characterB.nickname})}',
              {
                characterA: {
                  characterId: characterA.characterId,
                  nickname: characterA.nickname
                },
                characterB: {
                  characterId: characterB.characterId,
                  nickname: characterB.nickname
                }
              }
            );
            const center = getCenter([
              characterA.coordinates,
              characterB.coordinates
            ]);

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
                .emit('redirect', { page: Page.ENCOUNTER });

              getWorld()
                .to(characterB.characterId)
                .emit('redirect', { page: Page.ENCOUNTER });
            } else {
              logger.error('Something is wrong with a center');
            }
          }
        }
      });

      if (characterA.movesTo) {
        const distance = computeDistance(
          characterA.coordinates,
          characterA.movesTo,
          DISTANCE_ACCURACY
        );

        if (distance < characterA.speed / SPEED_MULTIPLIER) {
          characterA.coordinates = characterA.movesTo;
          characterA.movesTo = null;
          characterStore.set(characterA.characterId, {
            ...characterA
          });
          const sessionId = characterA.socket.data.sessionId;
          const session = sessionStore.get(sessionId);
          session.coordinates = characterA.coordinates;
          sessionStore.set(sessionId, session);
        } else {
          const bearing = computeBearing(
            characterA.coordinates,
            characterA.movesTo
          );

          const destination = computeDestination(
            characterA.coordinates,
            characterA.speed / SPEED_MULTIPLIER,
            bearing
          );

          characterA.coordinates = {
            lat: destination.latitude,
            lng: destination.longitude
          };
          characterStore.set(characterA.characterId, {
            ...characterA
          });
        }
      }

      if (characterA.encounterSightFlag) {
        getWorld()
          .to(characterA.characterId)
          .emit('encounters-in-sight', encountersInSight);

        if (!encountersInSight.length) {
          characterA.encounterSightFlag = false;
          characterStore.set(characterA.characterId, {
            ...characterA
          });
        }
      }

      if (characterA.characterSightFlag) {
        getWorld()
          .to(characterA.characterId)
          .emit('characters-in-sight', charactersInSight);

        if (!charactersInSight.length) {
          characterA.characterSightFlag = false;
          characterStore.set(characterA.characterId, {
            ...characterA
          });
        }
      }
    });
  }, 1000 / SPEED_MULTIPLIER);
}
