import { CharacterAtWorld, Character } from '@newordergame/common';

export function createCharacterAtWorld({ character }: { character: Character }): CharacterAtWorld {
  return {
    characterId: character.characterId,
    nickname: character.nickname,
    coordinates: character.coordinates,
    movesTo: null,
    stats: {
      sightRange: 100,
      speed: 30,
      outlook: [0, 0, 0]
    },
    encountersInSight: [],
    encounterSightFlag: false,
    charactersInSight: [],
    characterSightFlag: false
  };
}
