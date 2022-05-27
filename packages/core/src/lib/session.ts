import {
  DEFAULT_COORDINATES,
  NogPlayerId,
  NogPage,
  Session
} from '@newordergame/common';
import sessionStore from '../store/session-store';
import logger from './logger';

export function createSession({
  sessionId
}: {
  sessionId: NogPlayerId;
}): Session {
  const session: Session = {
    sessionId,
    nickname: '',
    coordinates: DEFAULT_COORDINATES,
    connected: true,
    encounterId: null,
    encounterEndTime: null,
    encounterStartTime: null,
    page: NogPage.ROOT
  };
  sessionStore.set(sessionId, session);
  return session;
}
