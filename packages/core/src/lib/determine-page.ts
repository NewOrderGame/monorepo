import { NogPage, Character } from '@newordergame/common';
import logger from './logger';

export function determinePage(character: Character): NogPage {
  // TODO: this method should always check what page user is on
  const page = character.encounterId ? NogPage.ENCOUNTER : NogPage.WORLD;
  logger.info('Determine page', { page });
  return page;
}
