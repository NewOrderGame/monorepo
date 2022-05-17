import { Character, Page } from '@newordergame/common';
import { getDistance as computeDistance } from 'geolib';
import { io } from '../io';
import { DISTANCE_ACCURACY } from '../utils/constants';
import { Namespace, Socket } from 'socket.io';
import characterStore from '../store/characterStore';
import sessionStore from '../store/sessionStore';
import { createCharacter } from '../utils/character';
import cognito from '../utils/cognito';
import { createSession } from '../utils/session';
import { handleDisconnect } from '../utils';

let worldNamespace: Namespace;

function handleWorldConnection(socket: Socket) {
  console.log('World connected', socket.id);
  const accessToken = socket.handshake.auth.accessToken;

  socket.on('init', () => {
    console.log('World init', socket.id);
    cognito.getUser(
      {
        AccessToken: accessToken
      },
      (error, response) => {
        if (error) {
          return console.error(error);
        }
        if (!response) {
          return console.error(new Error('There should be a response'));
        }
        const username = response?.Username;
        const nickname: string = response?.UserAttributes.find(
          (a) => a.Name === 'nickname'
        )?.Value;

        socket.data.sessionId = username;

        let session = sessionStore.get(username);
        if (!session) {
          session = createSession({ sessionId: username, nickname });
        }

        if (session.page === Page.WORLD) {
          let character: Character = characterStore.get(session.sessionId);
          if (!character) {
            character = createCharacter({ session, socket });
            characterStore.set(session.sessionId, character);
            console.log(`Created new character for ${character.nickname}`);
          }
          socket.emit('init', {
            coordinates: session.coordinates
          });
          socket.join(session.sessionId);
        }
      }
    );
  });

  socket.on('destroy', () => {
    if (!socket.data.sessionId) {
      console.error(new Error('There should be session ID'));
    }
    characterStore.delete(socket.data.sessionId);
  });

  socket.on('disconnect', async () => {
    characterStore.delete(socket.data.sessionId);
    await handleDisconnect('World', socket, worldNamespace);
  });

  socket.on('move', (coordinates: { lat: number; lng: number }) => {
    const session = sessionStore.get(socket.data.sessionId);
    if (!session) {
      return console.error(new Error('Session should exist'));
    }
    console.log(
      `Move ${session.nickname} to lat: ${coordinates.lat}, lng: ${coordinates.lng}.`
    );
    const characterId = session.sessionId;
    const character = characterStore.get(characterId);

    if (!character) {
      return new Error('Character should exist.');
    }

    characterStore.set(characterId, {
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

    socket.emit('move', { coordinates, duration, distance });
  });
}

export function initWorld() {
  console.log('Init World');
  worldNamespace = io.of('/world');
  worldNamespace.on('connection', handleWorldConnection);
}

export function getWorld(): Namespace {
  return worldNamespace;
}
