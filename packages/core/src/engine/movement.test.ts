import characterStore from '../store/character-store';
import encounterStore from '../store/encounter-store';
import sessionStore from '../store/session-store';
import { createSession } from '../utils/session';
import { nanoid } from 'nanoid';
import { createCharacter } from '../utils/character';
import { Character, NogEvent, Session } from '@newordergame/common';
import { Socket } from 'socket.io';
import { handleMoveEvent, moveCharacter } from './movement';
import {
  computeDestinationPoint as computeDestination,
  computeDestinationPoint,
  getDistance as computeDistance,
  getGreatCircleBearing as computeBearing
} from 'geolib';
import { DISTANCE_ACCURACY, SPEED_MULTIPLIER } from '../utils/constants';

const getFakeSocket = () =>
  ({
    emit: jest.fn(),
    data: {}
  } as unknown as Socket);

describe('Movement module', () => {
  beforeEach(() => {
    characterStore.clear();
    encounterStore.clear();
    sessionStore.clear();
  });

  describe('moveCharacter. Move character along with the tick', () => {
    test('Does nothing if "movesTo" is falsy', () => {
      const session = {
        ...createSession({ sessionId: nanoid() })
      };

      sessionStore.set(session.sessionId, session);

      const character = {
        ...createCharacter({
          session: session,
          socket: getFakeSocket()
        }),
        charactersInSight: [],
        encountersInSight: []
      } as Character;

      character.socket.data.sessionId = session.sessionId;

      characterStore.set(character.characterId, character);

      const sessionBefore = { ...session };
      const characterBefore = { ...character };

      moveCharacter(character);

      expect(session).toEqual(sessionBefore);
      expect(character).toEqual(characterBefore);
    });

    test('Does something if "movesTo" is defined', () => {
      const session = {
        ...createSession({ sessionId: nanoid() })
      };

      sessionStore.set(session.sessionId, session);

      const character = {
        ...createCharacter({
          session: session,
          socket: getFakeSocket()
        }),
        movesTo: { lat: 46.47684829298625, lng: 30.730953812599186 }
      } as Character;

      character.socket.data.sessionId = session.sessionId;

      characterStore.set(character.characterId, character);

      const sessionBefore = { ...session };
      const characterBefore = { ...character };

      moveCharacter(character);

      expect(session).not.toEqual(sessionBefore);
      expect(character).not.toEqual(characterBefore);
    });

    test('Assign final destination point to coordinates if distance is less than speed with multiplier', () => {
      const coordinates = { lat: 46.47684829298625, lng: 30.730953812599186 };

      const session = {
        ...createSession({ sessionId: nanoid() }),
        coordinates
      } as Session;

      sessionStore.set(session.sessionId, { ...session });

      const character = {
        ...createCharacter({
          session: session,
          socket: getFakeSocket()
        }),
        coordinates
      } as Character;

      const movesTo = computeDestinationPoint(
        coordinates,
        character.speed / SPEED_MULTIPLIER - 1,
        0
      );

      character.socket.data.sessionId = session.sessionId;

      characterStore.set(character.characterId, {
        ...character,
        movesTo: {
          lat: movesTo.latitude,
          lng: movesTo.longitude
        }
      });

      moveCharacter(character);

      expect(session.coordinates).not.toEqual(movesTo);
      expect(character.coordinates).not.toEqual(movesTo);
    });

    test('Assigns next destination point to coordinates if distance is greater than speed with multiplier', () => {
      const startCoordinates = {
        lat: 46.47684829298625,
        lng: 30.730953812599186
      };

      const session = {
        ...createSession({ sessionId: nanoid() }),
        coordinates: startCoordinates
      } as Session;
      sessionStore.set(session.sessionId, { ...session });

      const character = {
        ...createCharacter({
          session: session,
          socket: getFakeSocket()
        }),
        coordinates: startCoordinates
      } as Character;

      const destination = computeDestinationPoint(
        startCoordinates,
        character.speed / SPEED_MULTIPLIER + 100,
        0
      );
      const movesTo = { lat: destination.latitude, lng: destination.longitude };

      character.movesTo = movesTo;
      character.socket.data.sessionId = session.sessionId;
      characterStore.set(character.characterId, {
        ...character,
        movesTo
      });

      const bearing = computeBearing(character.coordinates, character.movesTo);

      const intermediateDestination = computeDestination(
        character.coordinates,
        character.speed / SPEED_MULTIPLIER,
        bearing
      );

      const intermediateCoordinates = {
        lat: intermediateDestination.latitude,
        lng: intermediateDestination.longitude
      };

      moveCharacter(character);

      expect(character.coordinates).toEqual(intermediateCoordinates);
      expect(sessionStore.get(session.sessionId).coordinates).toEqual(
        intermediateCoordinates
      );
      expect(characterStore.get(character.characterId).coordinates).toEqual(
        intermediateCoordinates
      );
    });
  });

  describe('handleMoveEvent. Handles the movement request', () => {
    const startCoordinates = {
      lat: 46.47684829298625,
      lng: 30.730953812599186
    };
    const movesTo = { lat: 46.47736917180925, lng: 30.7302188873291 };
    const socket = getFakeSocket();

    const session = {
      ...createSession({ sessionId: nanoid() }),
      coordinates: startCoordinates
    } as Session;
    sessionStore.set(session.sessionId, { ...session });

    socket.data.sessionId = session.sessionId;

    const character = {
      ...createCharacter({
        session: session,
        socket
      }),
      coordinates: startCoordinates
    } as Character;
    characterStore.set(character.characterId, { ...character });

    const distance = computeDistance(
      {
        latitude: character.coordinates.lat,
        longitude: character.coordinates.lng
      },
      {
        latitude: movesTo.lat,
        longitude: movesTo.lng
      },
      DISTANCE_ACCURACY
    );

    const duration = distance / character.speed;

    handleMoveEvent(socket, movesTo);

    expect(characterStore.get(character.characterId).movesTo).toEqual(movesTo);
    expect(socket.emit).toHaveBeenCalledWith(NogEvent.MOVE, {
      coordinates: movesTo,
      duration,
      distance
    });
  });
});
