import { NogEvent, NogNamespace, NogPage } from '@newordergame/common';
import { io } from '../io';
import characterStore from '../store/character-store';
import logger from '../lib/utils/logger';
import { Namespace, Socket } from 'socket.io';
import { getUser } from '../lib/utils/cognito';
import { handleDisconnect } from '../lib/utils/handle-disconnect';
import { determinePage } from '../lib/utils/determine-page';
import { handleCreateCharacter } from '../lib/character';
import { GetUserResponse } from 'aws-sdk/clients/cognitoidentityserviceprovider';
import characterAtWorldStore from '../store/character-at-world-store';

let authNamespace: Namespace;

const handleAuthConnection = async (socket: Socket) => {
  logger.info('Auth connected', { socketId: socket.id });

  if (socket.handshake.auth.npcServiceSecret === 'NPC_SERVICE_SECRET') {
    logger.debug('WE HAVE NPC SERVICE!');
    const allNpc = characterAtWorldStore.getAllNpc();
    socket.emit(NogEvent.INIT, allNpc);
    return;
  }

  const accessToken = socket.handshake.auth.accessToken;
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
    socket.join(character.characterId);
  }

  socket.emit(NogEvent.REDIRECT, {
    page
  });

  logger.info('Auth sent redirect', {
    page,
    characterId: username,
    nickname: character?.nickname
  });

  socket.on(
    NogEvent.DISCONNECT,
    async () => await handleDisconnect(NogNamespace.AUTH, socket, authNamespace)
  );

  socket.on(NogEvent.CREATE_CHARACTER, (props) => {
    handleCreateCharacter(props);
    socket.emit(NogEvent.REDIRECT, {
      page: NogPage.WORLD
    });
  });
}

export const initAuth = () => {
  logger.info('Init Auth');
  authNamespace = io.of('/auth');
  authNamespace.on(NogEvent.CONNECTION, handleAuthConnection);
}

export const getAuth = (): Namespace => {
  return authNamespace;
}
