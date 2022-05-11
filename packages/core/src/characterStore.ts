import { Character } from '@newordergame/common';

class CharacterStore {
  getCharacter(id: string) {}
  setCharacter(id: string, character: Character) {}
  deleteCharacter(id: string, character: Character) {}
  findAllCharacters() {}
}

export class InMemoryCharacterStore extends CharacterStore {
  private _characters: Map<string, Character>;

  constructor() {
    super();
    this._characters = new Map<string, Character>();
  }

  getCharacter(id: string) {
    return this._characters.get(id);
  }

  setCharacter(id: string, character: Character) {
    this._characters.set(id, character);
  }

  deleteCharacter(id: string) {
    this._characters.delete(id);
  }

  findAllCharacters(): Character[] {
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
