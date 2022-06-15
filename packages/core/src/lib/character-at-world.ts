import { CharacterAtWorld, Character } from '@newordergame/common';

export const createCharacterAtWorld = ({
  character,
  isNpc
}: {
  character: Character;
  isNpc: boolean;
}): CharacterAtWorld => {
  return {
    characterId: character.characterId,
    nickname: character.nickname,
    coordinates: character.coordinates,
    stats: character.stats,
    movesTo: null,
    encountersInSight: [],
    encounterSightFlag: false,
    charactersInSight: [],
    characterSightFlag: false,
    isNpc
  };
}
