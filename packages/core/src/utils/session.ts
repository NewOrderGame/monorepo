import { DEFAULT_COORDINATES, Page, Session } from '@newordergame/common';
import sessionStore from '../store/sessionStore';

export function createSession({
  sessionId,
  nickname
}: {
  sessionId: string;
  nickname: string;
}): Session {
  const session: Session = {
    sessionId,
    nickname,
    coordinates: DEFAULT_COORDINATES,
    connected: true,
    encounterId: '',
    encounterEndTime: null,
    page: Page.LOGIN
  };
  sessionStore.set(sessionId, session);
  return session;
}

export function determinePage(session: Session): Page {
  // TODO: this method should always check what page user is on
  const page = session.encounterId ? Page.ENCOUNTER : Page.WORLD;

  console.log('Determine page:', page);

  return page;
}
