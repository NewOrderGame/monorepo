import { Encounter } from '@newordergame/common';

export class InMemoryEncounterStore {
  private _encounters: Map<string, Encounter>;

  constructor() {
    console.log('Creating Encounter Store');
    this._encounters = new Map<string, Encounter>();
  }

  get(id: string): Encounter {
    return this._encounters.get(id);
  }

  set(id: string, encounter: Encounter) {
    this._encounters.set(id, encounter);
  }

  delete(id: string) {
    this._encounters.delete(id);
  }

  findAll(): Encounter[] {
    return [...this._encounters.values()];
  }

  size(): number {
    return this._encounters.size;
  }

  forEach(callback: (value: Encounter, key: string) => void) {
    return this._encounters.forEach.call(this._encounters, callback);
  }
}

const store = new InMemoryEncounterStore();
export default store;
