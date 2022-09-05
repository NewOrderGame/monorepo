import { Character, NogPage } from '@newordergame/common';
import logger from './logger';

export const determinePage = (character: Character): NogPage => {
  // TODO: this method should always check what page user is on
  let page;

  if (!character) {
    page = NogPage.CHARACTER;
  } else if (character.encounterId) {
    page = NogPage.ENCOUNTER;
  } else if (character.buildingId) {
    page = NogPage.LOCATION_SITE;
  } else {
    page = NogPage.WORLD;
  }

  logger.info(
    {
      page,
      characterId: character?.characterId,
      nickname: character?.nickname
    },
    'Determine page'
  );
  return page;
};
