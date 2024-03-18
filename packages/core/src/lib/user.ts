import { Character, NogEvent, NogPage } from '@newordergame/common';
import { logger } from '@newordergame/common';
import { Namespace, Socket } from 'socket.io';
import { GetUserResponse } from 'aws-sdk/clients/cognitoidentityserviceprovider';
import { getUser } from './cognito';
import characterStore from './store/character-store';
import { determinePage } from './determine-page';
import { handleCreateCharacter } from './character';
import { handleExitEncounter, handleInitEncounterPage } from './encounter';
import { handleInitWorldPage, handleMoveCharacterAtWorld } from './world';
import {
  handleEnterBuilding,
  handleExitBuilding,
  handleEncounterServiceInitLocationSitePage
} from './enter-building';
import { handleLookAround } from './look-around';

export const handleUserConnection = async (
  socket: Socket,
  gameNamespace: Namespace
) => {
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
  const nickname: string | undefined = user.UserAttributes.find(
    (a) => a.Name === 'nickname'
  )?.Value;

  socket.data.characterId = username;

  const character = characterStore.get(username);

  if (!nickname) {
    throw new Error('Nickname not found');
  }

  addUserEventListeners(gameNamespace, socket, username, nickname);

  const page = determinePage(character as Character);

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
  logger.info(
    {
      page,
      characterId: username,
      nickname: character?.nickname
    },
    'Sent redirect'
  );
  socket.emit(NogEvent.CONNECTED);
};

const addUserEventListeners = (
  gameNamespace: Namespace,
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

  socket.on(NogEvent.ENTER_BUILDING, handleEnterBuilding(socket));

  socket.on(
    NogEvent.INIT_LOCATION_SITE_PAGE,
    handleEncounterServiceInitLocationSitePage(socket)
  );

  socket.on(NogEvent.EXIT_LOCATION_SITE, handleExitBuilding(socket));

  socket.on(NogEvent.LOOK_AROUND, handleLookAround(socket));
};
