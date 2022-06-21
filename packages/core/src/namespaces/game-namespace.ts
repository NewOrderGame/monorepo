import { NogEvent, NogPage } from '@newordergame/common';
import { io } from '../lib/utils/io';
import logger from '../lib/utils/logger';
import { Namespace, Socket } from 'socket.io';
import { handleDisconnect } from '../lib/utils/handle-disconnect';
import { GetUserResponse } from 'aws-sdk/clients/cognitoidentityserviceprovider';
import { getUser } from '../lib/utils/cognito';
import characterStore from '../store/character-store';
import { determinePage } from '../lib/utils/determine-page';
import { handleCreateCharacter } from '../lib/character';
import { handleInitEncounterPage, handleExitEncounter } from '../lib/encounter';
import {
  handleDestroyCharacterAtWorld,
  handleInitWorldPage,
  handleMoveCharacterAtWorld
} from '../lib/world';
import { handleNpcServiceConnection } from '../lib/npc';

let gameNamespace: Namespace;

export const initGameNamespace = () => {
  logger.info('Init Game');
  gameNamespace = io.of('/game');
  gameNamespace.on(NogEvent.CONNECTION, handleGameConnection(gameNamespace));
};

export const getGameNamespace = () => {
  return gameNamespace;
};

const handleGameConnection =
  (gameNamespace: Namespace) => async (socket: Socket) => {
    logger.info({ socketId: socket.id }, 'Game connected');

    handleNpcServiceConnection(socket);
    await handleUserConnection(socket);

    socket.on(NogEvent.DISCONNECT, () =>
      handleDisconnect(socket, gameNamespace)
    );

    socket.emit(NogEvent.CONNECTED);
  };

const handleUserConnection = async (socket: Socket) => {
  const accessToken = socket.handshake.auth.accessToken;

  if (!accessToken) {
    return;
  }

  let user: GetUserResponse;

  try {
    user = await getUser(accessToken);
  } catch (error) {
    logger.error(error, 'Error during getting user in Game Namespace');
    return;
  }

  const username = user.Username;
  const nickname: string = user.UserAttributes.find(
    (a) => a.Name === 'nickname'
  )?.Value;

  socket.data.characterId = username;

  const character = characterStore.get(username);
  const page = determinePage(character);

  addGameEventListeners(socket, username, nickname);

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
  logger.info({
    page,
    characterId: username,
    nickname: character?.nickname
  }, 'Sent redirect');
};

const addGameEventListeners = (
  socket: Socket,
  characterId: string,
  nickname: string
) => {
  socket.on(NogEvent.CREATE_CHARACTER, async (props) => {
    await handleCreateCharacter(props);
    socket.emit(NogEvent.REDIRECT, {
      page: NogPage.WORLD
    });
  });

  socket.on(
    NogEvent.INIT_WORLD_PAGE,
    handleInitWorldPage(socket, characterId, nickname)
  );

  socket.on(
    NogEvent.MOVE_CHARACTER_AT_WORLD,
    (coordinates: { lat: number; lng: number }) =>
      handleMoveCharacterAtWorld(socket, coordinates)
  );

  socket.on(
    NogEvent.INIT_ENCOUNTER_PAGE,
    handleInitEncounterPage(socket, characterId)
  );

  socket.on(
    NogEvent.EXIT_ENCOUNTER,
    handleExitEncounter(socket, gameNamespace)
  );
};
