import { Character, NogEvent, Page } from '@newordergame/common';
import { io } from '../io';
import { Namespace, Socket } from 'socket.io';
import characterStore from '../store/character-store';
import sessionStore from '../store/session-store';
import { createCharacter } from '../lib/character';
import cognito from '../lib/cognito';
import { createSession } from '../lib/session';
import { handleDisconnect } from '../lib/handle-disconnect';
import logger from '../lib/logger';
import { handleMoveEvent } from '../engine/movement';

let worldNamespace: Namespace;

function handleWorldConnection(socket: Socket) {
  logger.info('World connected', { socketId: socket.id });
  const accessToken = socket.handshake.auth.accessToken;

  socket.on(NogEvent.INIT, () => {
    logger.info('World init', { socketId: socket.id });
    cognito.getUser(
      {
        AccessToken: accessToken
      },
      (error, response) => {
        if (error) {
          return logger.error(error);
        }
        if (!response) {
          return logger.error('There should be a response');
        }
        const username = response?.Username;
        const nickname: string = response?.UserAttributes.find(
          (a) => a.Name === 'nickname'
        )?.Value;

        socket.data.sessionId = username;

        let session = sessionStore.get(username);
        if (!session) {
          session = createSession({ sessionId: username });
        }

        if (session.page === Page.WORLD) {
          let character: Character = characterStore.get(session.sessionId);
          if (!character) {
            character = createCharacter({ session });
            characterStore.set(session.sessionId, character);
            logger.info('Created new character', {
              nickname: nickname
            });
          }
          socket.emit(NogEvent.INIT, {
            coordinates: session.coordinates
          });
          sessionStore.set(session.sessionId, { ...session, connected: true });
          socket.join(session.sessionId);
        }
      }
    );
  });

  socket.on(NogEvent.DESTROY, async () => {
    const session = sessionStore.get(socket.data.sesssionId);
    if (session) {
      characterStore.delete(socket.data.sessionId);
      logger.info('Removed character from world', {
        socketId: socket.id,
        sessionId: socket.data.sessionId
      });
    }
  });

  socket.on(NogEvent.DISCONNECT, async () => {
    characterStore.delete(socket.data.sessionId);
    await handleDisconnect('World', socket, worldNamespace);
  });

  socket.on(NogEvent.MOVE, (coordinates: { lat: number; lng: number }) =>
    handleMoveEvent(socket, coordinates)
  );
}

export function initWorld() {
  logger.info('Init World');
  worldNamespace = io.of('/world');
  worldNamespace.on(NogEvent.CONNECTION, handleWorldConnection);
}

export function getWorld(): Namespace {
  return worldNamespace;
}
