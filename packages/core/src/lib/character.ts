import { Character, Session } from '@newordergame/common';

export function createCharacter({ session }: { session: Session }): Character {
  return {
    characterId: session.sessionId,
    nickname: session.nickname,
    coordinates: session.coordinates,
    movesTo: null,
    sightRange: 100,
    speed: 30,
    encountersInSight: [],
    encounterSightFlag: false,
    charactersInSight: [],
    characterSightFlag: false
  };
}
