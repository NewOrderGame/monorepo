import {
  Encounter,
  NogCharacterId,
  NogEncounterId
} from '@newordergame/common';
import { logger } from '@newordergame/common';

export class InMemoryEncounterStore {
  private _encounters: Map<NogCharacterId, Encounter>;

  constructor() {
    logger.info('Creating Encounter store');
    this._encounters = new Map<NogEncounterId, Encounter>();
  }

  get(id: NogEncounterId): Encounter | undefined {
    return this._encounters.get(id);
  }

  set(id: NogEncounterId, encounter: Encounter) {
    this._encounters.set(id, encounter);
  }

  delete(id: NogEncounterId) {
    this._encounters.delete(id);
  }

  size(): number {
    return this._encounters.size;
  }

  forEach(callback: (value: Encounter, key: NogEncounterId) => void) {
    return this._encounters.forEach.call(this._encounters, callback);
  }

  clear() {
    return this._encounters.clear();
  }

  getAll(): Encounter[] {
    return Array.from(this._encounters.values());
  }
}

const store = new InMemoryEncounterStore();
export default store;
