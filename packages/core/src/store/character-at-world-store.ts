import { CharacterAtWorld, NogCharacterId } from '@newordergame/common';
import logger from '../lib/utils/logger';

export class InMemoryCharacterAtWorldStore {
  private _charactersAtWorld: Map<NogCharacterId, CharacterAtWorld>;

  constructor() {
    logger.info('Creating Character store');
    this._charactersAtWorld = new Map<NogCharacterId, CharacterAtWorld>();
  }

  get(id: NogCharacterId): CharacterAtWorld {
    return this._charactersAtWorld.get(id);
  }

  set(id: NogCharacterId, character: CharacterAtWorld) {
    this._charactersAtWorld.set(id, character);
  }

  delete(id: NogCharacterId) {
    this._charactersAtWorld.delete(id);
  }

  size(): number {
    return this._charactersAtWorld.size;
  }

  forEach(callback: (value: CharacterAtWorld, key: NogCharacterId) => void) {
    return this._charactersAtWorld.forEach.call(
      this._charactersAtWorld,
      callback
    );
  }

  clear() {
    this._charactersAtWorld.clear();
  }

  getAll(): CharacterAtWorld[] {
    return Array.from(this._charactersAtWorld.values());
  }
}

const store = new InMemoryCharacterAtWorldStore();
export default store;
