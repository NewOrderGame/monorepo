import {
  Character,
  DEFAULT_COORDINATES,
  errorWithLogout,
  Session
} from '@newordergame/common';
import { nanoid } from 'nanoid';
import { getDistance as computeDistance } from 'geolib';
import { io } from '../io';
import { DISTANCE_ACCURACY } from '../utils/constants';
import { Namespace, Socket } from 'socket.io';
import characterStore from '../store/characterStore';
import sessionStore from '../store/sessionStore';

let world: Namespace;

function handleWorldConnection(socket: Socket) {
  const sessionId = socket.handshake.auth.sessionId;
  // TODO: send UserID instead of Username, use Cognito
  const username = socket.handshake.auth.username;
  let session: Session;

  if (sessionId) {
    session = sessionStore.get(sessionId);
    if (session) {
      console.log(`Found existing session for ${session.username}`);
      socket.data.sessionId = sessionId;
      session.connected = true;
      sessionStore.set(sessionId, session);
    } else {
      return errorWithLogout('Invalid session ID', socket);
    }
  } else if (username) {
    const sessionId = nanoid();
    const userId = nanoid();
    socket.data.sessionId = sessionId;
    session = {
      sessionId,
      userId,
      username,
      coordinates: DEFAULT_COORDINATES,
      connected: true,
      page: 'world'
    };
    sessionStore.set(sessionId, session);
    console.log(`Created new session for ${username}`);
  } else {
    return errorWithLogout('No SessionID, no Username.', socket);
  }
  console.log('Connected', socket.id, session.username);

  let character: Character = characterStore.get(session.userId);

  if (!character) {
    character = {
      sessionId: session.sessionId,
      userId: session.userId,
      username: session.username,
      coordinates: session.coordinates,
      movesTo: null,
      sightRange: 100,
      speed: 30,
      encountersInSight: [],
      encounterSightFlag: false,
      charactersInSight: [],
      characterSightFlag: false,
      socket: socket
    };
    characterStore.set(session.userId, character);
    console.log(`Created new character for ${character.username}`);
  }

  socket.emit('session', {
    sessionId: session.sessionId,
    username: session.username,
    userId: session.userId,
    coordinates: session.coordinates,
    page: session.page
  });

  socket.join(session.userId);

  socket.on('disconnect', async () => {
    const session = sessionStore.get(socket.data.sessionId);
    console.log('Disconnect', socket.id);
    const matchingSockets = await world.in(session.userId).allSockets();
    const isDisconnected = matchingSockets.size === 0;
    if (isDisconnected) {
      sessionStore.set(session.sessionId, {
        ...session,
        connected: false
      });
      characterStore.delete(session.userId);
    }
  });

  socket.on('move', (coordinates: { lat: number; lng: number }) => {
    const session = sessionStore.get(socket.data.sessionId);
    console.log(
      `Move ${session.username} to lat: ${coordinates.lat}, lng: ${coordinates.lng}.`
    );
    const userId = session.userId;
    const character = characterStore.get(userId);

    if (!character) {
      return errorWithLogout('Character should exist.', socket);
    }

    characterStore.set(userId, {
      ...character,
      movesTo: coordinates
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

    world.to(userId).emit('move', { coordinates, duration, distance });
  });
}

export function initWorld() {
  console.log('Init World');
  world = io.of('/world');
  world.on('connection', handleWorldConnection);
}

export function getWorld(): Namespace {
  return world;
}
