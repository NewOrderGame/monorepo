import { Character, Session } from '@newordergame/common';
import { Socket } from 'socket.io';

export function createCharacter({
  session,
  socket
}: {
  session: Session;
  socket: Socket;
}): Character {
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
    characterSightFlag: false,
    socket
  };
}
