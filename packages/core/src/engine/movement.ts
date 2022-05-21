import sessionStore from '../store/session-store';
import logger from '../utils/logger';
import characterStore from '../store/character-store';
import {
  computeDestinationPoint as computeDestination,
  getDistance as computeDistance,
  getGreatCircleBearing as computeBearing
} from 'geolib';
import { DISTANCE_ACCURACY, SPEED_MULTIPLIER } from '../utils/constants';
import { Character, NogEvent } from '@newordergame/common';
import { Socket } from 'socket.io';

export function moveCharacter(character: Character) {
  if (!character.movesTo) {
    return;
  }

  const distance = computeDistance(
    character.coordinates,
    character.movesTo,
    DISTANCE_ACCURACY
  );

  const sessionId = character.socket.data.sessionId;
  const session = sessionStore.get(sessionId);

  if (distance < character.speed / SPEED_MULTIPLIER) {
    session.coordinates = character.coordinates;
    sessionStore.set(sessionId, { ...session });

    character.coordinates = character.movesTo;
    character.movesTo = null;
    characterStore.set(character.characterId, {
      ...character
    });
  } else {
    const bearing = computeBearing(character.coordinates, character.movesTo);

    const destination = computeDestination(
      character.coordinates,
      character.speed / SPEED_MULTIPLIER,
      bearing
    );

    const coordinates = {
      lat: destination.latitude,
      lng: destination.longitude
    };

    session.coordinates = coordinates;
    sessionStore.set(sessionId, { ...session });

    character.coordinates = coordinates;
    characterStore.set(character.characterId, {
      ...character
    });
  }
}

export function handleMoveEvent(
  socket: Socket,
  coordinates: { lat: number; lng: number }
) {
  const session = sessionStore.get(socket.data.sessionId);
  if (!session) {
    return logger.error('Session should exist');
  }
  logger.info('Move', { nickname: session.nickname, coordinates });
  const characterId = session.sessionId;
  const character = characterStore.get(characterId);

  if (!character) {
    return new Error('Character should exist.');
  }

  character.movesTo = coordinates;
  characterStore.set(characterId, {
    ...character
  });

  const distance = computeDistance(
    {
      latitude: character.coordinates.lat,
      longitude: character.coordinates.lng
    },
    { latitude: coordinates.lat, longitude: coordinates.lng },
    DISTANCE_ACCURACY
  );

  const duration = distance / character.speed;

  socket.emit(NogEvent.MOVE, { coordinates, duration, distance });
}
