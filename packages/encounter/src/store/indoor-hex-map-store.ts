import { NogBuildingId } from '@newordergame/common';
import { IndoorHexMap, logger } from '@newordergame/common';

export class InMemoryIndoorHexMapStore {
  private _characters: Map<NogBuildingId, IndoorHexMap>;

  constructor() {
    logger.info('Creating IndoorHexMap At World store');
    this._characters = new Map<NogBuildingId, IndoorHexMap>();
  }

  get(id: NogBuildingId): IndoorHexMap | undefined {
    return this._characters.get(id);
  }

  set(id: NogBuildingId, character: IndoorHexMap) {
    this._characters.set(id, character);
  }
}

const store = new InMemoryIndoorHexMapStore();
export default store;
