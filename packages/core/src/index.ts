import { Server } from 'socket.io';
import { nanoid } from 'nanoid';
import characterStore from './characterStore';
import sessionStore from './sessionStore';
import {
  Character,
  CharacterInSight,
  DEFAULT_COORDINATES,
  EncounterInSight,
  errorWithLogout,
  Session
} from '@newordergame/common';
import {
  computeDestinationPoint as computeDestination,
  getCenter,
  getDistance as computeDistance,
  getGreatCircleBearing as computeBearing
} from 'geolib';
import encounterStore from './encounterStore';

const SPEED_MULTIPLIER = 4;
const DISTANCE_ACCURACY = 0.001;
const ENCOUNTER_DISTANCE = 10;

const UI_ORIGIN =
  process.env.NODE_ENV === 'development'
    ? 'http://10.108.1.8:3000'
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
  const session = sessionStore.get(sessionId);
  if (session) {
    socket.emit('get-username', { username: session.username });
    console.log(`Sent username to ${session.username}`);
  } else {
    socket.emit('get-username', { username: null });
  }
});

// ================================================================================================

const world = io.of('/world');

world.on('connection', (socket) => {
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

    console.log(JSON.stringify(session));

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
});

// ================================================================================================

const encounter = io.of('/encounter');

encounter.on('connection', (socket) => {
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
      page: 'encounter'
    };
    sessionStore.set(sessionId, session);
    console.log(`Created new session for ${username}`);
  } else {
    return errorWithLogout('No SessionID, no Username.', socket);
  }
  console.log('Connected', socket.id, session.username);

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
});

// ================================================================================================
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

            world.to(characterA.userId).emit('encounter', {
              encounterId,
              username: characterB.username
            });

            world.to(characterB.userId).emit('encounter', {
              encounterId,
              username: characterA.username
            });

            characterA.socket.disconnect();
            characterB.socket.disconnect();

            characterStore.delete(characterA.userId);
            characterStore.delete(characterB.userId);
          } else {
            console.error(new Error(''));
          }
        }
      }
    });

    // emit stage
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
      world
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
      world
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
