import { NogPage, Character } from '@newordergame/common';
import logger from './logger';

export function determinePage(character: Character): NogPage {
  // TODO: this method should always check what page user is on
  let page;

  if (!character) {
    page = NogPage.CHARACTER;
  } else if (character.encounterId) {
    page = NogPage.ENCOUNTER;
  } else {
    page = NogPage.WORLD;
  }
  logger.info('Determine page', { page });
  return page;
}
