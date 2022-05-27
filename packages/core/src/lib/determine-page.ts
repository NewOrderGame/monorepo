import { Page, Session } from '@newordergame/common';
import logger from './logger';

export function determinePage(session: Session): Page {
  // TODO: this method should always check what page user is on
  const page = session.encounterId ? Page.ENCOUNTER : Page.WORLD;
  logger.info('Determine page', { page });
  return page;
}
