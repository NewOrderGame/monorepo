import characterStore from './store/character-store';
import moment from 'moment';
import {
  Character,
  Encounter,
  EncounterParticipant,
  GeoCoordinates,
  NogCharacterId,
  NogEncounterId,
  NogEvent,
  NogPage,
  logger
} from '@newordergame/common';
import encounterStore from './store/encounter-store';
import { Namespace, Socket } from 'socket.io';
import characterAtWorldStore from './store/character-at-world-store';
import { getCenter, getDistance } from 'geolib';
import {
  DISTANCE_ACCURACY,
  ENCOUNTER_COOL_DOWN_TIME,
  ENCOUNTER_DISTANCE
} from './constants';
import {
  getEncounterSocket,
  setEncounterSocket
} from './store/encounter-socket-store';
import { nanoid } from 'nanoid';

export const handleEncounterServiceConnection = (encounterSocket: Socket) => {
  const isEncounterService =
    encounterSocket.handshake.auth.encounterServiceSecret ===
    process.env.NOG_ENCOUNTER_SERVICE_SECRET;

  if (!isEncounterService) {
    return;
  }

  encounterSocket.emit(NogEvent.CONNECTED);
  logger.info('Encounter service connected');
  setEncounterSocket(encounterSocket);

  // encounterSocket.on(
  //   NogEvent.CREATE_ENCOUNTER_COMMIT,
  //   (coordinates: GeoCoordinates) => {
  //     const encounter = createEncounter();
  //   }
  // );
};

export const createEncounter = (
  participants: EncounterParticipant[],
  coordinates: GeoCoordinates
) => {
  return {
    encounterId: nanoid(),
    startTime: Date.now(),
    participants,
    coordinates,
    buildingId: null
    // units: Unit[];
    // weather: Weather;
  };
};

export const handleCharactersEncounter = (
  characterIdA: NogCharacterId,
  characterIdB: NogCharacterId
) => {
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

  if (!characterA || !characterB) {
    logger.error('Character not found');
    return;
  }

  let canEncounter: boolean = true;

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
    const encounterServiceSocket = getEncounterSocket();

    if (!encounterServiceSocket) {
      logger.error('Encounter service is missing');
      return;
    }

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
    const center = getCenter([
      characterAtWorldA.coordinates,
      characterAtWorldB.coordinates
    ]);

    if (!center) {
      logger.error('Could not find center');
      return;
    }

    const centerCoordinates = {
      lat: center.latitude,
      lng: center.longitude
    };

    encounterServiceSocket.emit(NogEvent.CREATE_ENCOUNTER, {
      characterIdA: characterA.characterId,
      characterIdB: characterB.characterId,
      coordinates: centerCoordinates
    });
  }
};

export const handleCharacterJoinEncounter = (
  characterId: NogCharacterId,
  encounterId: NogEncounterId,
  gameNamespace: Namespace
) => {
  const characterAtWorld = characterAtWorldStore.get(characterId);
  const encounter = encounterStore.get(encounterId);

  if (!characterAtWorld || !encounter) {
    return;
  }

  const distance = getDistance(
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

  const character = characterStore.get(characterAtWorld.characterId);

  if (!character) {
    logger.error('Character not found');
    return;
  }

  let canEncounter: boolean = true;

  if (character.encounterEndTime) {
    const now = moment().valueOf();
    canEncounter =
      moment(character.encounterEndTime)
        .add(ENCOUNTER_COOL_DOWN_TIME, 'second')
        .diff(now) <= 0;
  }

  if (canEncounter && character.encounterEndTime) {
    character.encounterEndTime = null;
    characterStore.set(character.characterId, {
      ...character
    });
  }

  if (distance <= ENCOUNTER_DISTANCE && canEncounter) {
    logger.info(
      {
        characterAtWorld: {
          characterId: characterAtWorld.characterId,
          nickname: characterAtWorld.nickname
        },
        encounter: {
          characterId: encounter.encounterId
        }
      },
      'Encounter'
    );

    character.page = NogPage.ENCOUNTER;
    character.encounterId = encounterId;
    character.coordinates = encounter.coordinates;
    characterStore.set(character.characterId, { ...character });

    characterAtWorldStore.delete(characterAtWorld.characterId);

    encounterStore.set(encounterId, encounter);

    gameNamespace
      .to(characterAtWorld.characterId)
      .emit(NogEvent.REDIRECT, { page: NogPage.ENCOUNTER });
  }
};

export const exitEncounter = ({
  encounter,
  characterA,
  gameNamespace
}: {
  encounter: Encounter;
  characterA: Character;
  gameNamespace: Namespace;
}) => {
  if (characterA) {
    characterA.encounterId = null;
    characterA.page = NogPage.WORLD;
    characterA.encounterEndTime = moment().valueOf();
    characterA.coordinates = encounter.coordinates;

    characterStore.set(characterA.characterId, {
      ...characterA
    });

    encounter.participants = encounter.participants.filter(
      (participant) => participant.characterId !== characterA.characterId
    );

    if (!encounter.participants.length) {
      encounterStore.delete(encounter.encounterId);
    }

    gameNamespace.to(characterA.characterId).emit(NogEvent.REDIRECT, {
      page: NogPage.WORLD
    });
  }
};

export const handleExitEncounter =
  (socket: Socket, gameNamespace: Namespace) => () => {
    if (!socket.data.characterId) {
      logger.error('There should be character ID');
    }
    const characterA = characterStore.get(socket.data.characterId);

    if (!characterA) {
      logger.error('Character A not found');
      return;
    }

    const encounter = encounterStore.get(characterA.encounterId as string);

    if (!encounter) {
      logger.error('Encounter not found');
      return;
    }

    exitEncounter({ encounter, characterA, gameNamespace });
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
      const encounter: Encounter | undefined = encounterStore.get(
        character.encounterId as string
      );
      if (encounter) {
        socket.emit(NogEvent.INIT_ENCOUNTER_PAGE, {
          participants: encounter.participants
        });
      }
    }
  };
