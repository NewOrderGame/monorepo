import { Coord } from "@turf/turf";
import { LatLng } from "leaflet";

interface Session {
  sessionId: string;
  userId: string;
  username: string;
  connected: boolean;
  coordinates: LatLng;
}

class SessionStore {
  findSession(id: string) {}
  saveSession(id: string, session: Session) {}
  findAllSessions() {}
}

export class InMemorySessionStore extends SessionStore {
  private _sessions: Map<string, Session>;

  constructor() {
    super();
    this._sessions = new Map<string, Session>();
  }

  findSession(id: string) {
    return this._sessions.get(id);
  }

  saveSession(id: string, session: Session) {
    this._sessions.set(id, session);
  }

  findAllSessions(): Session[] {
    return [...this._sessions.values()];
  }
}

export default new InMemorySessionStore();
