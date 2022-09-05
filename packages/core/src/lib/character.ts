import {
  Character,
  CharacterStats,
  DEFAULT_COORDINATES,
  NogCharacterId,
  NogPage,
  Outlook
} from '@newordergame/common';
import characterStore from '../store/character-store';
import logger from './utils/logger';
import { getUser } from './utils/cognito';
import { GetUserResponse } from 'aws-sdk/clients/cognitoidentityserviceprovider';

export const createCharacter = ({
  characterId,
  nickname,
  stats
}: {
  characterId: NogCharacterId;
  nickname: string;
  stats: CharacterStats;
}): Character => {
  const character: Character = {
    characterId,
    nickname,
    coordinates: DEFAULT_COORDINATES,
    connected: true,
    encounterId: null,
    buildingId: null,
    encounterEndTime: null,
    encounterStartTime: null,
    page: NogPage.WORLD,
    stats
  };
  characterStore.set(characterId, character);
  return character;
};

export const handleCreateCharacter = async ({
  accessToken,
  stats
}: {
  accessToken: string;
  stats: { outlook: Outlook };
}) => {
  let user: GetUserResponse;
  try {
    user = await getUser(accessToken);
  } catch (error) {
    logger.error(error, 'Error during getting user in Create Character');
    return;
  }
  const username = user?.Username;
  const nickname: string = user?.UserAttributes.find(
    (a) => a.Name === 'nickname'
  )?.Value;

  const character = createCharacter({
    characterId: username,
    nickname,
    stats: {
      ...stats,
      sightRange: 100,
      speed: 30
    }
  });
  characterStore.set(character.characterId, character);
};

export const areEnemies = (outlookA: Outlook, outlookB: Outlook): boolean => {
  return (
    (outlookA[0] > 0 && outlookB[0] < 0) ||
    (outlookA[0] < 0 && outlookB[0] > 0) ||
    (outlookA[1] > 0 && outlookB[1] < 0) ||
    (outlookA[1] < 0 && outlookB[1] > 0) ||
    (outlookA[2] > 0 && outlookB[2] < 0) ||
    (outlookA[2] < 0 && outlookB[2] > 0)
  );
};
