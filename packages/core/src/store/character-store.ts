import { NogCharacterId, Character } from '@newordergame/common';
import logger from '../lib/utils/logger';

export class InMemoryCharacterStore {
  private _characters: Map<NogCharacterId, Character>;

  constructor() {
    logger.info('Creating Character At World Store');
    this._characters = new Map<NogCharacterId, Character>();
  }

  get(id: NogCharacterId): Character {
    return this._characters.get(id);
  }

  set(id: NogCharacterId, character: Character) {
    this._characters.set(id, character);
  }

  clear() {
    this._characters.clear();
  }
}

const store = new InMemoryCharacterStore();
export default store;
