import characterStore from '../store/character-store';
import logger from './logger';
import characterAtWorldStore from '../store/character-at-world-store';
import {
  computeDestinationPoint as computeDestination,
  getDistance as computeDistance,
  getGreatCircleBearing as computeBearing
} from 'geolib';
import { DISTANCE_ACCURACY, TICK_PER_SECOND } from './constants';
import { NogCharacterId, NogEvent } from '@newordergame/common';
import { Socket } from 'socket.io';

export function moveCharacter(characterId: NogCharacterId) {
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
}

export function handleMoveEvent(
  socket: Socket,
  coordinates: { lat: number; lng: number }
) {
  const character = characterStore.get(socket.data.characterId);
  if (!character) {
    return logger.error('Character should exist');
  }
  logger.info('Move', { nickname: character.nickname, coordinates });
  const characterId = character.characterId;
  const characterAtWorld = characterAtWorldStore.get(characterId);

  if (!characterAtWorld) {
    return new Error('Character should exist.');
  }

  characterAtWorld.movesTo = coordinates;
  characterAtWorldStore.set(characterId, {
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

  socket.emit(NogEvent.MOVE, { coordinates, duration, distance });
}
