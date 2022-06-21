import characterStore from '../store/character-store';
import * as moment from 'moment';
import logger from './utils/logger';
import {
  Encounter,
  EncounterParticipant,
  NogCharacterId,
  NogEncounterId,
  NogEvent,
  NogPage
} from '@newordergame/common';
import encounterStore from '../store/encounter-store';
import { Namespace, Socket } from 'socket.io';
import characterAtWorldStore from '../store/character-at-world-store';
import { getCenter as computeCenter, getDistance } from 'geolib';
import {
  DISTANCE_ACCURACY,
  ENCOUNTER_COOL_DOWN_TIME,
  ENCOUNTER_DISTANCE
} from './utils/constants';
import { nanoid } from 'nanoid';

export const handleCharactersEncounter = (
  characterIdA: NogCharacterId,
  characterIdB: NogCharacterId,
  gameNamespace: Namespace
) => {
  const characterAtWorldA = characterAtWorldStore.get(characterIdA);
  const characterAtWorldB = characterAtWorldStore.get(characterIdB);

  if (!characterAtWorldA || !characterAtWorldB) {
    return;
  }

  if (characterAtWorldA.characterId === characterAtWorldB.characterId) {
    return;
  }

  if (characterAtWorldA.isNpc || characterAtWorldB.isNpc) {
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
    logger.info(
      {
        characterAtWorldA: {
          characterId: characterAtWorldA.characterId,
          nickname: characterAtWorldA.nickname
        },
        characterAtWorldB: {
          characterId: characterAtWorldB.characterId,
          nickname: characterAtWorldB.nickname
        }
      },
      'Encounter'
    );
    const center = computeCenter([
      characterAtWorldA.coordinates,
      characterAtWorldB.coordinates
    ]);

    if (!center) {
      logger.error('Could not find center');
      return;
    }

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

    gameNamespace
      .to(characterAtWorldA.characterId)
      .emit(NogEvent.REDIRECT, { page: NogPage.ENCOUNTER });

    gameNamespace
      .to(characterAtWorldB.characterId)
      .emit(NogEvent.REDIRECT, { page: NogPage.ENCOUNTER });

    logger.trace('Send redirect on create encounter');
  }
};

export const handleExitEncounter =
  (socket: Socket, gameNamespace: Namespace) => () => {
    if (!socket.data.characterId) {
      logger.error('There should be character ID');
    }
    const characterA = characterStore.get(socket.data.characterId);
    const encounter = encounterStore.get(characterA.encounterId);
    if (!encounter) {
      return logger.error('There should be an encounter');
    }
    const characterB = characterStore.get(
      encounter.participants.find(
        (p: EncounterParticipant) => p.characterId !== characterA.characterId
      ).characterId
    );

    characterA.encounterId = null;
    characterA.page = NogPage.WORLD;
    characterA.encounterEndTime = moment().valueOf();
    characterA.encounterStartTime = null;
    characterA.coordinates = encounter.coordinates;
    characterStore.set(characterA.characterId, {
      ...characterA
    });

    characterB.encounterId = null;
    characterB.page = NogPage.WORLD;
    characterB.encounterEndTime = moment().valueOf();
    characterB.encounterStartTime = null;
    characterB.coordinates = encounter.coordinates;
    characterStore.set(characterB.characterId, {
      ...characterB
    });

    encounterStore.delete(encounter.encounterId);

    gameNamespace.to(characterA.characterId).emit(NogEvent.REDIRECT, {
      page: NogPage.WORLD
    });

    gameNamespace.to(characterB.characterId).emit(NogEvent.REDIRECT, {
      page: NogPage.WORLD
    });

    logger.trace({ timestamp: Date.now() }, 'Send redirect on exit');
  };

export const handleInitEncounterPage =
  (socket: Socket, characterId: string) => async () => {
    logger.info({ socketId: socket.id }, 'Encounter init');

    const character = characterStore.get(characterId);
    if (!character) {
      socket.emit(NogEvent.REDIRECT, {
        page: NogPage.CHARACTER
      });
      return;
    }

    if (character.page === NogPage.ENCOUNTER) {
      const encounter: Encounter = encounterStore.get(character.encounterId);
      if (encounter) {
        socket.emit(NogEvent.INIT_ENCOUNTER_PAGE, {
          participants: encounter.participants
        });
      }
    }
  };
