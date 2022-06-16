import { Namespace, Socket } from 'socket.io';
import logger from './utils/logger';
import { NogEvent, NogPage } from '@newordergame/common';
import { GetUserResponse } from 'aws-sdk/clients/cognitoidentityserviceprovider';
import { getUser } from './utils/cognito';
import characterStore from '../store/character-store';
import { determinePage } from './utils/determine-page';
import { handleDisconnect } from './utils/handle-disconnect';
import { handleCreateCharacter } from './character';
import { handleNpcServiceAuthConnection } from './npc';

const handleConnection = async (socket: Socket) => {
  const accessToken = socket.handshake.auth.accessToken;

  if (!accessToken) {
    return;
  }

  let user: GetUserResponse;
  try {
    user = await getUser(accessToken);
  } catch (error) {
    logger.error('Error during getting user in Auth Namespace', error);
    return;
  }
  const username = user.Username;
  const nickname: string = user.UserAttributes.find(
    (a) => a.Name === 'nickname'
  )?.Value;
  socket.data.characterId = username;

  let character = characterStore.get(username);
  const page = determinePage(character);

  if (character) {
    characterStore.set(character.characterId, {
      ...character,
      nickname,
      page,
      connected: true
    });
  }

  socket.join(username);
  socket.emit(NogEvent.REDIRECT, {
    page
  });
  logger.info('Auth sent redirect', {
    page,
    characterId: username,
    nickname: character?.nickname
  });

  socket.on(NogEvent.CREATE_CHARACTER, (props) => {
    handleCreateCharacter(props);
    socket.emit(NogEvent.REDIRECT, {
      page: NogPage.WORLD
    });
  });
};

export const handleAuthConnection =
  (authNamespace: Namespace) => async (socket: Socket) => {
    logger.info('Auth connected', { socketId: socket.id });

    handleNpcServiceAuthConnection(socket, authNamespace);
    await handleConnection(socket);

    socket.on(NogEvent.DISCONNECT, handleAuthDisconnect(socket, authNamespace));
  };

const handleAuthDisconnect =
  (socket: Socket, authNamespace: Namespace) => async () => {
    await handleDisconnect(socket, authNamespace);
  };
