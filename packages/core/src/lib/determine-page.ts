import { logger, Character, NogPage } from '@newordergame/common';

export const determinePage = (character: Character): NogPage => {
  let page;

  if (!character) {
    page = NogPage.CHARACTER;
  } else if (character.encounterId) {
    page = NogPage.ENCOUNTER;
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
