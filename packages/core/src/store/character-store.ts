import { Character, NogPlayerId } from '@newordergame/common';
import logger from '../lib/logger';

export class InMemoryCharacterStore {
  private _characters: Map<NogPlayerId, Character>;

  constructor() {
    logger.info('Creating Character store');
    this._characters = new Map<NogPlayerId, Character>();
  }

  get(id: NogPlayerId): Character {
    return this._characters.get(id);
  }

  set(id: NogPlayerId, character: Character) {
    this._characters.set(id, character);
  }

  delete(id: NogPlayerId) {
    this._characters.delete(id);
  }

  size(): number {
    return this._characters.size;
  }

  forEach(callback: (value: Character, key: NogPlayerId) => void) {
    return this._characters.forEach.call(this._characters, callback);
  }

  clear() {
    this._characters.clear();
  }

  getAll(): Character[] {
    return Array.from(this._characters.values());
  }
}

const store = new InMemoryCharacterStore();
export default store;
