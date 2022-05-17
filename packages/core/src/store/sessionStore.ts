import { Session } from '@newordergame/common';

export class InMemorySessionStore {
  private _sessions: Map<string, Session>;

  constructor() {
    console.log('Creating Session Store');
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
