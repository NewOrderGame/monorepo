import { Session } from '@newordergame/common';

export class InMemorySessionStore {
  private _sessions: Map<string, Session>;

  constructor() {
    this._sessions = new Map<string, Session>();
  }

  get(id: string) {
    return this._sessions.get(id);
  }

  set(id: string, session: Session) {
    this._sessions.set(id, session);
  }
}

export default new InMemorySessionStore();
