import { getDistance as computeDistance } from 'geolib';
import { DISTANCE_ACCURACY } from '../utils/constants';
import characterStore from '../store/character-store';
import {
  Character,
  CharacterInSight,
  Encounter,
  EncounterInSight,
  NogEvent
} from '@newordergame/common';

export function checkCharacterVisibility(
  characterA: Character,
  characterB: Character,
  charactersInSight: CharacterInSight[]
) {
  if (characterA.characterId === characterB.characterId) {
    return;
  }

  const distance = computeDistance(
    {
      latitude: characterA.coordinates.lat,
      longitude: characterA.coordinates.lng
    },
    {
      latitude: characterB.coordinates.lat,
      longitude: characterB.coordinates.lng
    },
    DISTANCE_ACCURACY
  );

  if (distance <= characterA.sightRange) {
    charactersInSight.push({
      coordinates: characterB.coordinates,
      characterId: characterB.characterId,
      nickname: characterB.nickname,
      distance
    });

    characterA.characterSightFlag = true;
    characterStore.set(characterA.characterId, {
      ...characterA
    });
  }
}

export function sendCharactersInSight(
  character: Character,
  charactersInSight: CharacterInSight[]
) {
  if (character.characterSightFlag) {
    character.socket.emit(NogEvent.CHARACTERS_IN_SIGHT, charactersInSight);
  }

  if (!charactersInSight.length) {
    character.characterSightFlag = false;
    characterStore.set(character.characterId, {
      ...character
    });
  }
}

export function checkEncounterVisibility(
  character: Character,
  encounter: Encounter,
  encountersInSight: EncounterInSight[]
) {
  const distance = computeDistance(
    {
      latitude: character.coordinates.lat,
      longitude: character.coordinates.lng
    },
    {
      latitude: encounter.coordinates.lat,
      longitude: encounter.coordinates.lng
    },
    DISTANCE_ACCURACY
  );

  if (distance < character.sightRange) {
    encountersInSight.push({
      encounterId: encounter.encounterId,
      coordinates: encounter.coordinates,
      participants: encounter.participants,
      distance
    });

    character.encounterSightFlag = true;
    characterStore.set(character.characterId, {
      ...character
    });
  }
}

export function sendEncountersInSight(
  character: Character,
  encountersInSight: EncounterInSight[]
) {
  if (character.encounterSightFlag) {
    character.socket.emit(NogEvent.ENCOUNTERS_IN_SIGHT, encountersInSight);
  }

  if (!encountersInSight.length) {
    character.encounterSightFlag = false;
    characterStore.set(character.characterId, {
      ...character
    });
  }
}
