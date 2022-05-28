import {
  Character,
  DEFAULT_COORDINATES,
  NogCharacterId,
  NogPage
} from '@newordergame/common';
import characterStore from '../store/character-store';

export function createCharacter({
  characterId
}: {
  characterId: NogCharacterId;
}): Character {
  const character: Character = {
    characterId: characterId,
    nickname: '',
    coordinates: DEFAULT_COORDINATES,
    connected: true,
    encounterId: null,
    encounterEndTime: null,
    encounterStartTime: null,
    page: NogPage.ROOT
  };
  characterStore.set(characterId, character);
  return character;
}
