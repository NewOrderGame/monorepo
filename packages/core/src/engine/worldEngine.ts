import { nanoid } from 'nanoid';
import { CharacterInSight, EncounterInSight } from '@newordergame/common';
import {
  computeDestinationPoint as computeDestination,
  getCenter,
  getDistance as computeDistance,
  getGreatCircleBearing as computeBearing
} from 'geolib';
import { getWorld } from '../namespaces/world';
import { DISTANCE_ACCURACY, ENCOUNTER_DISTANCE, SPEED_MULTIPLIER } from '../utils/constants';
import characterStore from '../store/characterStore';
import encounterStore from '../store/encounterStore';
import sessionStore from '../store/sessionStore';

export function runWorld() {
  setInterval(() => {
    characterStore.forEach((characterA, userIdA) => {
      const charactersInSight: CharacterInSight[] = [];
      const encountersInSight: EncounterInSight[] = [];

      encounterStore.forEach((encounter, encounterId) => {
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
          characterStore.set(characterA.userId, {
            ...characterA
          });
        }
      });

      characterStore.forEach((characterB, userIdB) => {
        if (userIdA !== userIdB) {
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
              userId: characterB.userId,
              username: characterB.username,
              distance
            });

            characterA.characterSightFlag = true;
            characterStore.set(characterA.userId, {
              ...characterA
            });
          }

          if (distance <= ENCOUNTER_DISTANCE) {
            const encounterId = nanoid();
            const center = getCenter([
              characterA.coordinates,
              characterB.coordinates
            ]);

            if (center) {
              encounterStore.set(encounterId, {
                coordinates: { lat: center.latitude, lng: center.longitude },
                encounterId: encounterId,
                participants: [
                  { userId: characterA.userId, username: characterA.username },
                  { userId: characterB.userId, username: characterB.username }
                ]
              });

              getWorld().to(characterA.userId).emit('encounter', {
                encounterId,
                username: characterB.username
              });

              getWorld().to(characterB.userId).emit('encounter', {
                encounterId,
                username: characterA.username
              });

              characterA.socket.disconnect();
              characterB.socket.disconnect();

              characterStore.delete(characterA.userId);
              characterStore.delete(characterB.userId);
            } else {
              console.error(new Error('Something is wrong with a center'));
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
          characterStore.set(characterA.userId, {
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
          characterStore.set(characterA.userId, {
            ...characterA
          });
        }
      }

      if (characterA.encounterSightFlag) {
        getWorld()
          .to(characterA.userId)
          .emit('encounters-in-sight', encountersInSight);

        if (!encountersInSight.length) {
          characterA.encounterSightFlag = false;
          characterStore.set(characterA.userId, {
            ...characterA
          });
        }
      }

      if (characterA.characterSightFlag) {
        getWorld()
          .to(characterA.userId)
          .emit('characters-in-sight', charactersInSight);

        if (!charactersInSight.length) {
          characterA.characterSightFlag = false;
          characterStore.set(characterA.userId, {
            ...characterA
          });
        }
      }
    });
  }, 1000 / SPEED_MULTIPLIER);
}
