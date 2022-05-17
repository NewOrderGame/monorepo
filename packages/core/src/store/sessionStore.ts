import { Session } from '@newordergame/common';
import logger from '../utils/logger';

export class InMemorySessionStore {
  private _sessions: Map<string, Session>;

  constructor() {
    logger.info('Creating Session Store');
    this._sessions = new Map<string, Session>();
  }

  get(id: string): Session {
    return this._sessions.get(id);
  }

  set(id: string, session: Session) {
    this._sessions.set(id, session);
  }
}

const store = new InMemorySessionStore();
export default store;