import { Namespace, Socket } from 'socket.io';
import logger from './utils/logger';
import characterAtWorldStore from '../store/character-at-world-store';
import {
  CharacterAtWorld,
  CharacterInSight,
  EncounterInSight,
  NogCharacterId,
  NogEncounterId,
  NogEvent,
  NogPage
} from '@newordergame/common';
import characterStore from '../store/character-store';
import {
  computeDestinationPoint as computeDestination,
  getCenter as computeCenter,
  getDistance,
  getDistance as computeDistance,
  getGreatCircleBearing as computeBearing
} from 'geolib';
import {
  DISTANCE_ACCURACY,
  ENCOUNTER_COOL_DOWN_TIME,
  ENCOUNTER_DISTANCE,
  TICK_PER_SECOND
} from './utils/constants';
import { areEnemies } from './character';
import encounterStore from '../store/encounter-store';
import * as moment from 'moment';
import { nanoid } from 'nanoid';
import { createCharacterAtWorld } from './character-at-world';

export const moveCharacter = (characterId: NogCharacterId) => {
  const characterAtWorld = characterAtWorldStore.get(characterId);

  if (!characterAtWorld) {
    return;
  }

  if (!characterAtWorld.movesTo) {
    return;
  }

  const distance = computeDistance(
    characterAtWorld.coordinates,
    characterAtWorld.movesTo,
    DISTANCE_ACCURACY
  );

  const character = characterStore.get(characterId);

  if (distance < characterAtWorld.stats.speed / TICK_PER_SECOND) {
    character.coordinates = characterAtWorld.movesTo;
    characterStore.set(character.characterId, { ...character });

    characterAtWorld.coordinates = characterAtWorld.movesTo;
    characterAtWorld.movesTo = null;
    characterAtWorldStore.set(characterAtWorld.characterId, {
      ...characterAtWorld
    });
  } else {
    const bearing = computeBearing(
      characterAtWorld.coordinates,
      characterAtWorld.movesTo
    );

    const destination = computeDestination(
      characterAtWorld.coordinates,
      characterAtWorld.stats.speed / TICK_PER_SECOND,
      bearing
    );

    const coordinates = {
      lat: destination.latitude,
      lng: destination.longitude
    };

    character.coordinates = coordinates;
    characterStore.set(character.characterId, { ...character });

    characterAtWorld.coordinates = coordinates;
    characterAtWorldStore.set(characterAtWorld.characterId, {
      ...characterAtWorld
    });
  }
};

export const checkCharacterVisibility = (
  characterIdA: NogCharacterId,
  characterIdB: NogCharacterId,
  charactersInSightA: CharacterInSight[],
  charactersInSightB: CharacterInSight[]
) => {
  const characterAtWorldA = characterAtWorldStore.get(characterIdA);
  const characterAtWorldB = characterAtWorldStore.get(characterIdB);

  if (!characterAtWorldA || !characterAtWorldB) {
    return;
  }

  const distance = computeDistance(
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

  if (distance <= characterAtWorldA.stats.sightRange) {
    charactersInSightA.push({
      coordinates: characterAtWorldB.coordinates,
      characterId: characterAtWorldB.characterId,
      nickname: characterAtWorldB.nickname,
      distance,
      isEnemy: areEnemies(
        characterAtWorldA.stats.outlook,
        characterAtWorldB.stats.outlook
      )
    });

    characterAtWorldA.characterSightFlag = true;
    characterAtWorldStore.set(characterAtWorldA.characterId, {
      ...characterAtWorldA
    });
  }

  if (distance <= characterAtWorldB.stats.sightRange) {
    charactersInSightB.push({
      coordinates: characterAtWorldA.coordinates,
      characterId: characterAtWorldA.characterId,
      nickname: characterAtWorldA.nickname,
      distance,
      isEnemy: areEnemies(
        characterAtWorldA.stats.outlook,
        characterAtWorldB.stats.outlook
      )
    });

    characterAtWorldB.characterSightFlag = true;
    characterAtWorldStore.set(characterAtWorldB.characterId, {
      ...characterAtWorldB
    });
  }
};

export const sendCharactersInSight = (
  characterId: NogCharacterId,
  charactersInSight: CharacterInSight[],
  gameNamespace: Namespace
) => {
  const characterAtWorld = characterAtWorldStore.get(characterId);
  if (!characterAtWorld) {
    return;
  }

  if (characterAtWorld.characterSightFlag) {
    gameNamespace
      .to(characterAtWorld.characterId)
      .emit(NogEvent.CHARACTERS_IN_SIGHT, charactersInSight);
  }

  if (!charactersInSight.length) {
    characterAtWorld.characterSightFlag = false;
    characterAtWorldStore.set(characterAtWorld.characterId, {
      ...characterAtWorld
    });
  }
};

export const checkEncounterVisibility = (
  characterId: NogCharacterId,
  encounterId: NogCharacterId,
  encountersInSight: EncounterInSight[]
) => {
  const characterAtWorld = characterAtWorldStore.get(characterId);

  if (!characterAtWorld) {
    return;
  }

  const encounter = encounterStore.get(encounterId);

  const distance = computeDistance(
    {
      latitude: characterAtWorld.coordinates.lat,
      longitude: characterAtWorld.coordinates.lng
    },
    {
      latitude: encounter.coordinates.lat,
      longitude: encounter.coordinates.lng
    },
    DISTANCE_ACCURACY
  );

  if (distance < characterAtWorld.stats.sightRange) {
    encountersInSight.push({
      encounterId: encounter.encounterId,
      coordinates: encounter.coordinates,
      participants: encounter.participants,
      distance
    });

    characterAtWorld.encounterSightFlag = true;
    characterAtWorldStore.set(characterAtWorld.characterId, {
      ...characterAtWorld
    });
  }
};

export const sendEncountersInSight = (
  characterId: NogCharacterId,
  encountersInSight: EncounterInSight[],
  gameNamespace: Namespace
) => {
  const characterAtWorld = characterAtWorldStore.get(characterId);

  if (!characterAtWorld) {
    return;
  }

  if (characterAtWorld.encounterSightFlag) {
    gameNamespace
      .to(characterAtWorld.characterId)
      .emit(NogEvent.ENCOUNTERS_IN_SIGHT, encountersInSight);
  }

  if (!encountersInSight.length) {
    characterAtWorld.encounterSightFlag = false;
    characterAtWorldStore.set(characterAtWorld.characterId, {
      ...characterAtWorld
    });
  }
};

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

      gameNamespace
        .to(characterAtWorldA.characterId)
        .emit(NogEvent.REDIRECT, { page: NogPage.ENCOUNTER });
      gameNamespace
        .to(characterAtWorldB.characterId)
        .emit(NogEvent.REDIRECT, { page: NogPage.ENCOUNTER });
    } else {
      logger.error('Something is wrong with a center');
    }
  }
};

export const handleInitCharacterAtWorld =
  (socket: Socket, characterId: string, nickname: string) => async () => {
    logger.info('World init', { socketId: socket.id });
    const character = characterStore.get(characterId);
    if (!character) {
      socket.emit(NogEvent.REDIRECT, {
        page: NogPage.CHARACTER
      });
      return;
    }

    if (character.page === NogPage.WORLD) {
      let characterAtWorld: CharacterAtWorld = characterAtWorldStore.get(
        character.characterId
      );
      if (!characterAtWorld) {
        characterAtWorld = createCharacterAtWorld({
          character: character,
          isNpc: false
        });
        characterAtWorldStore.set(character.characterId, characterAtWorld);
        logger.info('Created new characterAtWorld', {
          nickname
        });
      }
      socket.emit(NogEvent.INIT_CHARACTER_AT_WORLD, {
        coordinates: character.coordinates
      });
      characterStore.set(character.characterId, {
        ...character,
        connected: true
      });
    }
  };

export const handleDestroyCharacterAtWorld = (socket: Socket) => () => {
  const character = characterStore.get(socket.data.sesssionId);
  if (character) {
    characterAtWorldStore.delete(socket.data.characterId);
    logger.info('Removed character from world', {
      socketId: socket.id,
      characterId: socket.data.characterId
    });
  }
};

export const handleMoveCharacterAtWorld = (
  socket: Socket,
  coordinates: { lat: number; lng: number }
) => {
  const character = characterStore.get(socket.data.characterId);
  if (!character) {
    logger.error('Character should exist');
    return;
  }

  const characterAtWorld = characterAtWorldStore.get(character.characterId);

  if (!characterAtWorld) {
    logger.error('Character at world should exist');
    return;
  }

  logger.info('Move', {
    nickname: character.nickname,
    characterId: character.characterId,
    coordinates
  });

  characterAtWorld.movesTo = coordinates;
  characterAtWorldStore.set(character.characterId, {
    ...characterAtWorld
  });

  const distance = computeDistance(
    {
      latitude: characterAtWorld.coordinates.lat,
      longitude: characterAtWorld.coordinates.lng
    },
    { latitude: coordinates.lat, longitude: coordinates.lng },
    DISTANCE_ACCURACY
  );

  const duration = distance / characterAtWorld.stats.speed;

  socket.emit(NogEvent.MOVE_CHARACTER_AT_WORLD, {
    coordinates,
    duration,
    distance
  });
};
