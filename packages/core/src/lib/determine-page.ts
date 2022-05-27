import { NogPage, Session } from '@newordergame/common';
import logger from './logger';

export function determinePage(session: Session): NogPage {
  // TODO: this method should always check what page user is on
  const page = session.encounterId ? NogPage.ENCOUNTER : NogPage.WORLD;
  logger.info('Determine page', { page });
  return page;
}
