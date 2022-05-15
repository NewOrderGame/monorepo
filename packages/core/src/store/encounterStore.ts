import { Encounter } from '@newordergame/common';

export class InMemoryEncounterStore {
  private _encounters: Map<string, Encounter>;

  constructor() {
    this._encounters = new Map<string, Encounter>();
  }

  get(id: string) {
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

  size() {
    return this._encounters.size;
  }

  forEach(callback: (value: Encounter, key: string) => void) {
    return this._encounters.forEach.call(this._encounters, callback);
  }
}

export default new InMemoryEncounterStore();
