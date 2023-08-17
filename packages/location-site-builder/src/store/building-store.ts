import { NogBuildingId } from '@newordergame/common';
import { Building } from '../lib/building';
import logger from '../lib/utils/logger';

export class InMemoryBuildingStore {
  private _characters: Map<NogBuildingId, Building>;

  constructor() {
    logger.info('Creating Building At World store');
    this._characters = new Map<NogBuildingId, Building>();
  }

  get(id: NogBuildingId): Building | undefined {
    return this._characters.get(id);
  }

  set(id: NogBuildingId, character: Building) {
    this._characters.set(id, character);
  }
}

const store = new InMemoryBuildingStore();
export default store;
