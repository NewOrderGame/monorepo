import { Server } from 'socket.io';
import { nanoid } from 'nanoid';
import characterStore from './characterStore';
import sessionStore from './sessionStore';
import { CharacterInSight, DEFAULT_COORDINATES } from '@newordergame/common';
import {
  getGreatCircleBearing as computeBearing,
  computeDestinationPoint as computeDestination,
  getDistance as computeDistance
} from 'geolib';

const UI_ORIGIN =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://play.newordergame.com';

// ================================================================================================

const io = new Server({
  cors: {
    origin: UI_ORIGIN
  }
});

io.listen(5000);

// ================================================================================================

const auth = io.of('/auth');

auth.on('connection', (socket) => {
  console.log('Auth connected');
  const sessionId = socket.handshake.auth.sessionId;
  const session = sessionStore.findSession(sessionId);
  if (session) {
    socket.emit('get-username', { username: session.username });
    console.log(`Sent username to ${session.username}`);
  } else {
    socket.emit('get-username', { username: null });
  }
});

// ================================================================================================

const world = io.of('/world');

world.use((socket, next) => {
  const sessionId = socket.handshake.auth.sessionId;
  if (sessionId) {
    const session = sessionStore.findSession(sessionId);
    if (session) {
      socket.data.sessionId = sessionId;
      socket.data.userId = session.userId;
      socket.data.username = session.username;
      socket.data.coordinates = session.coordinates;
      console.log(`Found existing session for ${session.username}`);
      return next();
    }
  }

  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error('Invalid username'));
  }
  socket.data.sessionId = nanoid();
  socket.data.userId = nanoid();
  socket.data.username = username;
  socket.data.coordinates = DEFAULT_COORDINATES;
  console.log(`Created new session for ${username}`);
  return next();
});

world.on('connection', (socket) => {
  console.log('Connect', socket.id, socket.data.username);
  sessionStore.saveSession(socket.data.sessionId, {
    sessionId: socket.data.sessionId,
    userId: socket.data.userId,
    username: socket.data.username,
    connected: true,
    coordinates: socket.data.coordinates
  });

  const character = characterStore.getCharacter(socket.data.userId);

  if (!character) {
    console.log(`Created new character for ${socket.data.username}`);
    characterStore.setCharacter(socket.data.userId, {
      sessionId: socket.data.sessionId,
      userId: socket.data.userId,
      username: socket.data.username,
      coordinates: socket.data.coordinates,
      movesTo: null,
      sightDistance: 100,
      speed: 30,
      charactersInSight: []
    });
  }

  socket.emit('session', {
    sessionId: socket.data.sessionId,
    username: socket.data.username,
    userId: socket.data.userId,
    coordinates: socket.data.coordinates
  });

  socket.join(socket.data.userId);

  socket.on('disconnect', async () => {
    console.log('Disconnect', socket.id, socket.data.username);
    const matchingSockets = await world.in(socket.data.userId).allSockets();
    const isDisconnected = matchingSockets.size === 0;
    if (isDisconnected) {
      sessionStore.saveSession(socket.data.sessionId, {
        sessionId: socket.data.sessionId,
        userId: socket.data.userId,
        username: socket.data.username,
        connected: false,
        coordinates: socket.data.coordinates
      });

      characterStore.deleteCharacter(socket.data.userId);
    }
  });

  socket.on('move', (coordinates: { lat: number; lng: number }) => {
    console.log(
      `Move ${socket.data.username} to lat: ${coordinates.lat}, lng: ${coordinates.lng}.`
    );
    const character = characterStore.getCharacter(socket.data.userId);

    if (!character) {
      throw new Error('Character should exist.');
    }

    characterStore.setCharacter(socket.data.userId, {
      ...character,
      movesTo: coordinates
    });

    const distance = computeDistance(
      {
        latitude: socket.data.coordinates.lat,
        longitude: socket.data.coordinates.lng
      },
      { latitude: coordinates.lat, longitude: coordinates.lng },
      0.001
    );

    const duration = distance / character.speed;

    world
      .to(socket.data.userId)
      .emit('move', { coordinates, duration, distance });
  });
});

setInterval(() => {
  characterStore.forEach((characterX, userIdX) => {
    const charactersInSight: CharacterInSight[] = [];
    // comparison and setting
    characterStore.forEach((characterY, userIdY) => {
      if (userIdX !== userIdY) {
        const distance = computeDistance(
          {
            latitude: characterX.coordinates.lat,
            longitude: characterX.coordinates.lng
          },
          {
            latitude: characterY.coordinates.lat,
            longitude: characterY.coordinates.lng
          },
          0.001
        );
        if (distance <= characterX.sightDistance) {
          charactersInSight.push({
            coordinates: characterY.coordinates,
            userId: characterY.userId,
            username: characterY.username,
            distance
          });
        }
      }
    });

    // emit stage
    if (characterX.movesTo) {
      const socket = Array.from(world.sockets.values()).find((socket) => {
        return socket.data?.userId === characterX.userId;
      });

      const distance = computeDistance(
        {
          latitude: characterX.coordinates.lat,
          longitude: characterX.coordinates.lng
        },
        { latitude: characterX.movesTo.lat, longitude: characterX.movesTo.lng },
        0.001
      );

      if (distance < characterX.speed) {
        socket.data.coordinates = characterX.movesTo;

        characterStore.setCharacter(characterX.userId, {
          ...characterX,
          coordinates: characterX.movesTo,
          movesTo: null
        });
      } else {
        const bearing = computeBearing(
          {
            latitude: characterX.coordinates.lat,
            longitude: characterX.coordinates.lng
          },
          {
            latitude: characterX.movesTo.lat,
            longitude: characterX.movesTo.lng
          }
        );

        const destination = computeDestination(
          {
            latitude: characterX.coordinates.lat,
            longitude: characterX.coordinates.lng
          },
          characterX.speed,
          bearing
        );

        console.log(destination);

        const coordinates: { lat: number; lng: number } = {
          lat: destination.latitude,
          lng: destination.longitude
        };

        socket.data.coordinates = coordinates;

        characterStore.setCharacter(characterX.userId, {
          ...characterX,
          coordinates
        });
      }
    }

    world.to(characterX.userId).emit('characters-in-sight', charactersInSight);
  });
}, 1000);
