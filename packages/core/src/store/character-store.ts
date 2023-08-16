import { Character, NogCharacterId } from '@newordergame/common';
import logger from '../lib/utils/logger';

export class InMemoryCharacterStore {
  private _characters: Map<NogCharacterId, Character>;

  constructor() {
    logger.info('Creating Character At World store');
    this._characters = new Map<NogCharacterId, Character>();
  }

  get(id: NogCharacterId): Character | undefined {
    return this._characters.get(id);
  }

  set(id: NogCharacterId, character: Character) {
    this._characters.set(id, character);
  }

  delete(id: NogCharacterId) {
    this._characters.delete(id);
  }

  clear() {
    this._characters.clear();
  }
}

const store = new InMemoryCharacterStore();
export default store;
