import { DEFAULT_COORDINATES, Page, Session } from '@newordergame/common';
import sessionStore from '../store/session-store';
import logger from './logger';

export function createSession({ sessionId }: { sessionId: string }): Session {
  const session: Session = {
    sessionId,
    nickname: '',
    coordinates: DEFAULT_COORDINATES,
    connected: true,
    encounterId: null,
    encounterEndTime: null,
    encounterStartTime: null,
    page: Page.ROOT
  };
  sessionStore.set(sessionId, session);
  return session;
}

export function determinePage(session: Session): Page {
  // TODO: this method should always check what page user is on
  const page = session.encounterId ? Page.ENCOUNTER : Page.WORLD;
  logger.info('Determine page', { page });
  return page;
}
