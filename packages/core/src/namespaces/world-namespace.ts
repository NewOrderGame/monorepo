import {
  CharacterAtWorld,
  NogEvent,
  NogNamespace,
  NogPage
} from '@newordergame/common';
import { io } from '../io';
import { Namespace, Socket } from 'socket.io';
import characterAtWorldStore from '../store/character-at-world-store';
import characterStore from '../store/character-store';
import { createCharacterAtWorld } from '../lib/character-at-world';
import cognito from '../lib/cognito';
import { handleDisconnect } from '../lib/handle-disconnect';
import logger from '../lib/logger';
import { handleMoveEvent } from '../lib/movement';

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

        socket.data.characterId = username;

        let character = characterStore.get(username);
        if (!character) {
          return socket.emit(NogEvent.REDIRECT, {
            page: NogPage.CHARACTER
          });
        }

        if (character.page === NogPage.WORLD) {
          let characterAtWorld: CharacterAtWorld = characterAtWorldStore.get(
            character.characterId
          );
          if (!characterAtWorld) {
            characterAtWorld = createCharacterAtWorld({ character: character, isNpc: false });
            characterAtWorldStore.set(character.characterId, characterAtWorld);
            logger.info('Created new characterAtWorld', {
              nickname
            });
          }
          socket.emit(NogEvent.INIT, {
            coordinates: character.coordinates
          });
          characterStore.set(character.characterId, {
            ...character,
            connected: true
          });
          socket.join(character.characterId);
        }
      }
    );
  });

  socket.on(NogEvent.DESTROY, async () => {
    const character = characterStore.get(socket.data.sesssionId);
    if (character) {
      characterAtWorldStore.delete(socket.data.characterId);
      logger.info('Removed character from world', {
        socketId: socket.id,
        characterId: socket.data.characterId
      });
    }
  });

  socket.on(NogEvent.DISCONNECT, async () => {
    characterAtWorldStore.delete(socket.data.characterId);
    await handleDisconnect(NogNamespace.WORLD, socket, worldNamespace);
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
