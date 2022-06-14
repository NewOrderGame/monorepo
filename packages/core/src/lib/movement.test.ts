import characterAtWorldStore from '../store/character-at-world-store';
import encounterStore from '../store/encounter-store';
import characterStore from '../store/character-store';
import { createCharacter } from './character';
import { nanoid } from 'nanoid';
import { createCharacterAtWorld } from './character-at-world';
import {
  Character,
  CharacterAtWorld,
  CharacterStats,
  NogEvent
} from '@newordergame/common';
import { handleMoveEvent, moveCharacter } from './movement';
import {
  computeDestinationPoint as computeDestination,
  computeDestinationPoint,
  getDistance as computeDistance,
  getGreatCircleBearing as computeBearing
} from 'geolib';
import { DISTANCE_ACCURACY, TICK_PER_SECOND } from './utils/constants';
import { getFakeSocket } from '../test/utils';

const DEFAULT_CHARACTER_STATS: CharacterStats = {
  outlook: [0, 0, 0],
  speed: 30,
  sightRange: 100
};


describe('Movement module', () => {
  beforeEach(() => {
    characterAtWorldStore.clear();
    encounterStore.clear();
    characterStore.clear();
  });

  describe('moveCharacter. Move character along with the tick', () => {
    test('Does nothing if "movesTo" is falsy', () => {
      const character = {
        ...createCharacter({
          characterId: nanoid(),
          nickname: 'TestUser',
          stats: DEFAULT_CHARACTER_STATS
})
      };

      characterStore.set(character.characterId, character);

      const characterAtWorld = {
        ...createCharacterAtWorld({
          character: character,
          isNpc: false
        }),
        charactersInSight: [],
        encountersInSight: []
      } as CharacterAtWorld;

      characterAtWorldStore.set(characterAtWorld.characterId, characterAtWorld);

      const characterBefore = { ...character };
      const characterAtWorldBefore = { ...characterAtWorld };

      moveCharacter(characterAtWorld.characterId);

      expect(character).toEqual(characterBefore);
      expect(characterAtWorld).toEqual(characterAtWorldBefore);
    });

    test('Does something if "movesTo" is defined', () => {
      const character = {
        ...createCharacter({
          characterId: nanoid(),
          nickname: 'TestUser',
          stats: DEFAULT_CHARACTER_STATS
})
      };

      characterStore.set(character.characterId, character);

      const characterAtWorld = {
        ...createCharacterAtWorld({
          character: character,
          isNpc: false
        }),
        movesTo: { lat: 46.47684829298625, lng: 30.730953812599186 }
      } as CharacterAtWorld;

      characterAtWorldStore.set(characterAtWorld.characterId, characterAtWorld);

      const characterBefore = { ...character };
      const characterAtWorldBefore = { ...characterAtWorld };

      moveCharacter(characterAtWorld.characterId);

      expect(character).not.toEqual(characterBefore);
      expect(characterAtWorld).not.toEqual(characterAtWorldBefore);
    });

    test('Assign final destination point to coordinates if distance is less than speed with multiplier', () => {
      const coordinates = { lat: 46.47684829298625, lng: 30.730953812599186 };

      const character = {
        ...createCharacter({
          characterId: nanoid(),
          nickname: 'TestUser',
          stats: DEFAULT_CHARACTER_STATS
}),
        coordinates
      } as Character;

      characterStore.set(character.characterId, { ...character });

      const characterAtWorld = {
        ...createCharacterAtWorld({
          character: character,
          isNpc: false
        }),
        coordinates
      } as CharacterAtWorld;

      const movesTo = computeDestinationPoint(
        coordinates,
        characterAtWorld.stats.speed / TICK_PER_SECOND - 1,
        0
      );

      characterAtWorldStore.set(characterAtWorld.characterId, {
        ...characterAtWorld,
        movesTo: {
          lat: movesTo.latitude,
          lng: movesTo.longitude
        }
      });

      moveCharacter(characterAtWorld.characterId);

      expect(character.coordinates).not.toEqual(movesTo);
      expect(characterAtWorld.coordinates).not.toEqual(movesTo);
    });

    test('Assigns next destination point to coordinates if distance is greater than speed with multiplier', () => {
      const startCoordinates = {
        lat: 46.47684829298625,
        lng: 30.730953812599186
      };

      const character = {
        ...createCharacter({
          characterId: nanoid(),
          nickname: 'TestUser',
          stats: DEFAULT_CHARACTER_STATS
}),
        coordinates: startCoordinates
      } as Character;
      characterStore.set(character.characterId, { ...character });

      const characterBefore = {
        ...createCharacterAtWorld({
          character: character,
          isNpc: false
        }),
        coordinates: startCoordinates
      } as CharacterAtWorld;

      const destination = computeDestinationPoint(
        startCoordinates,
        characterBefore.stats.speed / TICK_PER_SECOND + 100,
        0
      );
      const movesTo = { lat: destination.latitude, lng: destination.longitude };

      characterBefore.movesTo = movesTo;
      characterAtWorldStore.set(characterBefore.characterId, {
        ...characterBefore,
        movesTo
      });

      const bearing = computeBearing(
        characterBefore.coordinates,
        characterBefore.movesTo
      );

      const intermediateDestination = computeDestination(
        characterBefore.coordinates,
        characterBefore.stats.speed / TICK_PER_SECOND,
        bearing
      );

      const intermediateCoordinates = {
        lat: intermediateDestination.latitude,
        lng: intermediateDestination.longitude
      };

      moveCharacter(characterBefore.characterId);

      const characterAfter = characterAtWorldStore.get(
        characterBefore.characterId
      );

      expect(characterAfter.coordinates).toEqual(intermediateCoordinates);
      expect(characterStore.get(character.characterId).coordinates).toEqual(
        intermediateCoordinates
      );
      expect(
        characterAtWorldStore.get(characterAfter.characterId).coordinates
      ).toEqual(intermediateCoordinates);
    });
  });

  describe('handleMoveEvent. Handles the movement request', () => {
    test(`Handles character's movement`, () => {
      const socket = getFakeSocket();
      const startCoordinates = {
        lat: 46.47684829298625,
        lng: 30.730953812599186
      };
      const movesTo = { lat: 46.47736917180925, lng: 30.7302188873291 };

      const character = {
        ...createCharacter({
          characterId: nanoid(),
          nickname: 'TestUser',
          stats: DEFAULT_CHARACTER_STATS
}),
        coordinates: startCoordinates
      } as Character;
      characterStore.set(character.characterId, { ...character });

      const characterAtWorld = {
        ...createCharacterAtWorld({
          character: character,
          isNpc: false
        }),
        coordinates: startCoordinates
      } as CharacterAtWorld;
      characterAtWorldStore.set(characterAtWorld.characterId, {
        ...characterAtWorld
      });

      const distance = computeDistance(
        {
          latitude: characterAtWorld.coordinates.lat,
          longitude: characterAtWorld.coordinates.lng
        },
        {
          latitude: movesTo.lat,
          longitude: movesTo.lng
        },
        DISTANCE_ACCURACY
      );

      const duration = distance / characterAtWorld.stats.speed;

      socket.data.characterId = character.characterId;

      handleMoveEvent(socket, movesTo);

      expect(
        characterAtWorldStore.get(characterAtWorld.characterId).movesTo
      ).toEqual(movesTo);
      expect(socket.emit).toHaveBeenCalledWith(NogEvent.MOVE, {
        coordinates: movesTo,
        duration,
        distance
      });
    });
  });
});
