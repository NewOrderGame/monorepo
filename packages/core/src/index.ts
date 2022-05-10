import { Server } from 'socket.io';
import { nanoid } from 'nanoid';
import characterStore from './characterStore';
import sessionStore from './sessionStore';
import { DEFAULT_COORDINATES } from '@newordergame/common/index';
import {
  bearing as calculateBearing,
  destination as calculateDestination,
  distance as calculateDistance
} from '@turf/turf';

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
  const sessionId = socket.handshake.auth.sessionId;
  const session = sessionStore.findSession(sessionId);
  if (session) {
    socket.emit('get-username', { username: session.username });
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
    characterStore.setCharacter(socket.data.userId, {
      sessionId: socket.data.sessionId,
      userId: socket.data.userId,
      username: socket.data.username,
      coordinates: socket.data.coordinates,
      movesTo: null,
      viewSight: 10,
      speed: 30
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
    const character = characterStore.getCharacter(socket.data.userId);

    if (!character) {
      throw new Error('Character should exist.');
    }

    characterStore.setCharacter(socket.data.userId, {
      ...character,
      movesTo: coordinates
    });
  });
});

setInterval(() => {
  console.log('worldCharacters: ', characterStore.size());

  characterStore.forEach((valueX, keyX) => {
    // comparison and setting
    characterStore.forEach((valueY, keyY) => {
      if (keyX !== keyY) {
        // console.log(keyX, keyY);
      }
    });

    // emit stage
    // console.log(keyX, valueX);
    if (valueX.movesTo) {
      const socket = Array.from(world.sockets.values()).find((socket) => {
        return socket.data?.userId === valueX.userId;
      });

      const distance = calculateDistance(
        [valueX.coordinates.lat, valueX.coordinates.lng],
        [valueX.movesTo.lat, valueX.movesTo.lng],
        { units: 'meters' }
      );

      if (distance < valueX.speed) {
        world.to(valueX.userId).emit('move', valueX.movesTo);
        characterStore.setCharacter(valueX.userId, {
          ...valueX,
          coordinates: valueX.movesTo,
          movesTo: null
        });

        socket.data.coordinates = valueX.movesTo;
      } else {
        const bearing = calculateBearing(
          [valueX.coordinates.lat, valueX.coordinates.lng],
          [valueX.movesTo.lat, valueX.movesTo.lng]
        );

        const destination = calculateDestination(
          [valueX.coordinates.lat, valueX.coordinates.lng],
          valueX.speed,
          bearing,
          { units: 'meters' }
        );

        const coordinates: { lat: number; lng: number } = {
          lat: destination.geometry.coordinates[0],
          lng: destination.geometry.coordinates[1]
        };

        world.to(valueX.userId).emit('move', coordinates);

        socket.data.coordinates = coordinates;

        characterStore.setCharacter(valueX.userId, {
          ...valueX,
          coordinates
        });
        socket.data.coordinates = coordinates;
      }
    }
  });
}, 1000);
