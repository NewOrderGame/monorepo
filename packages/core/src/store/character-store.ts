import { Character } from '@newordergame/common';
import logger from '../utils/logger';

export class InMemoryCharacterStore {
  private _characters: Map<string, Character>;

  constructor() {
    logger.info(
      'Creating character store',
    );
    this._characters = new Map<string, Character>();
  }

  get(id: string): Character {
    return this._characters.get(id);
  }

  set(id: string, character: Character) {
    this._characters.set(id, character);
  }

  delete(id: string) {
    this._characters.delete(id);
  }

  findAll(): Character[] {
    return [...this._characters.values()];
  }

  size(): number {
    return this._characters.size;
  }

  forEach(callback: (value: Character, key: string) => void) {
    return this._characters.forEach.call(this._characters, callback);
  }
}

const store = new InMemoryCharacterStore();
export default store;