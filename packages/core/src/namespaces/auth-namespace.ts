import { io } from '../io';
import characterStore from '../store/character-store';
import { Namespace, Socket } from 'socket.io';
import cognito from '../lib/cognito';
import { handleDisconnect } from '../lib/handle-disconnect';
import logger from '../lib/logger';
import { NogEvent, NogNamespace, NogPage } from '@newordergame/common';
import { determinePage } from '../lib/determine-page';
import { handleCreateCharacter } from '../lib/character';

let authNamespace: Namespace;

function handleAuthConnection(socket: Socket) {
  logger.info('Auth connected', { socketId: socket.id });
  const accessToken = socket.handshake.auth.accessToken;

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
      const username = response.Username;
      const nickname: string = response.UserAttributes.find(
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
    }
  );

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

export function initAuth() {
  logger.info('Init Auth');
  authNamespace = io.of('/auth');
  authNamespace.on(NogEvent.CONNECTION, handleAuthConnection);
}

export function getAuth(): Namespace {
  return authNamespace;
}
