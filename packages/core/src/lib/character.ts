import {
  Character,
  CharacterStats,
  DEFAULT_COORDINATES,
  NogCharacterId,
  NogPage,
  Outlook
} from '@newordergame/common';
import characterStore from '../store/character-store';
import cognito from './cognito';
import logger from './logger';

export function createCharacter({
  characterId,
  nickname,
  stats
}: {
  characterId: NogCharacterId;
  nickname: string;
  stats: CharacterStats;
}): Character {
  const character: Character = {
    characterId,
    nickname,
    coordinates: DEFAULT_COORDINATES,
    connected: true,
    encounterId: null,
    encounterEndTime: null,
    encounterStartTime: null,
    page: NogPage.WORLD,
    stats
  };
  characterStore.set(characterId, character);
  return character;
}

export const handleCreateCharacter = ({
  accessToken,
  stats
}: {
  accessToken: string;
  stats: { outlook: Outlook };
}) => {
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

      console.log(nickname);
      console.log(username);

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
    }
  );
};

export function areEnemies(outlookA: Outlook, outlookB: Outlook): boolean {
  return (
    (outlookA[0] > 0 && outlookB[0] < 0) ||
    (outlookA[0] < 0 && outlookB[0] > 0) ||
    (outlookA[1] > 0 && outlookB[1] < 0) ||
    (outlookA[1] < 0 && outlookB[1] > 0) ||
    (outlookA[2] > 0 && outlookB[2] < 0) ||
    (outlookA[2] < 0 && outlookB[2] > 0)
  );
}
