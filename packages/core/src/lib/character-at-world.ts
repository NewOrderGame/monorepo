import { Character, CharacterAtWorld } from '@newordergame/common';

export const createCharacterAtWorld = ({
  character
}: {
  character: Character;
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
    characterSightFlag: false
  };
};
