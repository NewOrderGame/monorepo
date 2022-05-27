import { NogPlayerId, Session } from '@newordergame/common';
import logger from '../lib/logger';

export class InMemorySessionStore {
  private _sessions: Map<NogPlayerId, Session>;

  constructor() {
    logger.info('Creating Session Store');
    this._sessions = new Map<NogPlayerId, Session>();
  }

  get(id: NogPlayerId): Session {
    return this._sessions.get(id);
  }

  set(id: NogPlayerId, session: Session) {
    this._sessions.set(id, session);
  }

  clear() {
    this._sessions.clear();
  }
}

const store = new InMemorySessionStore();
export default store;
