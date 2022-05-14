import { Character } from '@newordergame/common';

export class InMemoryCharacterStore {
  private _characters: Map<string, Character>;

  constructor() {
    this._characters = new Map<string, Character>();
  }

  get(id: string) {
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

  size() {
    return this._characters.size;
  }

  forEach(callback: (value: Character, key: string) => void) {
    return this._characters.forEach.call(this._characters, callback);
  }
}

export default new InMemoryCharacterStore();
