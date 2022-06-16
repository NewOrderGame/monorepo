import { Socket } from "socket.io";

import logger from '../lib/utils/logger';

export class InMemoryNpcSocketStore {
  private _characters: Map<string, Socket>;

  constructor() {
    logger.info('Creating Character At World Store');
    this._characters = new Map<string, Socket>();
  }

  get(namespaceName: string): Socket {
    return this._characters.get(namespaceName);
  }

  set(namespaceName: string, character: Socket) {
    this._characters.set(namespaceName, character);
  }

  clear() {
    this._characters.clear();
  }
}

const store = new InMemoryNpcSocketStore();
export default store;
