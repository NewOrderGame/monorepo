import {
  Character,
  CharacterAtWorld,
  CharacterInSight,
  Coordinates,
  DEFAULT_COORDINATES,
  NogCharacterId,
  NogPage
} from '@newordergame/common';
import { NPC_GENERATION_THRESHOLD } from './constants';
import { computeDestinationPoint as computeDestination } from 'geolib';
import { createCharacterAtWorld } from './character-at-world';
import { createCharacter } from './character';
import { nanoid } from 'nanoid';
import characterAtWorldStore from '../store/character-at-world-store';

export function handleNpcGeneration(
  coordinates: Coordinates,
  sightRange: number,
  charactersInSightNumber: number
) {
  if (
    charactersInSightNumber < NPC_GENERATION_THRESHOLD &&
    Math.random() < 0.1
  ) {
    const angle = Math.random() * 360;
    const distance = Math.random() * sightRange;

    const npcCoordinates = computeDestination(coordinates, distance, angle);

    const npc = createCharacterAtWorld({
      character: {
        characterId: `NPC-${nanoid()}` as NogCharacterId,
        nickname: nanoid(),
        coordinates: {
          lat: npcCoordinates.latitude,
          lng: npcCoordinates.longitude
        },
        connected: true,
        encounterId: null,
        encounterEndTime: null,
        encounterStartTime: null,
        page: NogPage.WORLD,
        stats: {
          sightRange: 100,
          speed: 30,
          outlook: [
            Math.random() * 200 - 100,
            Math.random() * 200 - 100,
            Math.random() * 200 - 100
          ]
        }
      },
      isNpc: true
    });

    characterAtWorldStore.set(npc.characterId, npc);
  }
}
