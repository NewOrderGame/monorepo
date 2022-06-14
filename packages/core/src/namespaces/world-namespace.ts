import {
  CharacterAtWorld,
  NogEvent,
  NogNamespace,
  NogPage
} from '@newordergame/common';
import { Namespace, Socket } from 'socket.io';
import { io } from '../io';
import characterAtWorldStore from '../store/character-at-world-store';
import characterStore from '../store/character-store';
import logger from '../lib/utils/logger';
import { createCharacterAtWorld } from '../lib/character-at-world';
import { getUser } from '../lib/utils/cognito';
import { handleDisconnect } from '../lib/utils/handle-disconnect';
import { handleMoveEvent } from '../lib/movement';
import { GetUserResponse } from 'aws-sdk/clients/cognitoidentityserviceprovider';

let worldNamespace: Namespace;

function handleWorldConnection(socket: Socket) {
  logger.info('World connected', { socketId: socket.id });
  const accessToken = socket.handshake.auth.accessToken;

  async function handleInit() {
    logger.info('World init', { socketId: socket.id });
    let user: GetUserResponse;
    try {
      user = await getUser(accessToken);
    } catch (error) {
      logger.error('Error during getting user in World Namespace', error);
      return;
    }
    const username = user?.Username;
    const nickname: string = user?.UserAttributes.find(
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
        characterAtWorld = createCharacterAtWorld({
          character: character,
          isNpc: false
        });
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

  function handleDestroy() {
    const character = characterStore.get(socket.data.sesssionId);
    if (character) {
      characterAtWorldStore.delete(socket.data.characterId);
      logger.info('Removed character from world', {
        socketId: socket.id,
        characterId: socket.data.characterId
      });
    }
  }

  socket.on(NogEvent.INIT, handleInit);
  socket.on(NogEvent.DESTROY, handleDestroy);
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
