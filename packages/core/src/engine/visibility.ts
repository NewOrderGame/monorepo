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
import encounterStore from "../store/encounter-store";

export function checkCharacterVisibility(
  characterIdA: string,
  characterIdB: string,
  charactersInSightA: CharacterInSight[],
  charactersInSightB: CharacterInSight[]
) {
  const characterA = characterStore.get(characterIdA);
  const characterB = characterStore.get(characterIdB);

  if (!characterA || !characterB) {
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
    charactersInSightA.push({
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

  if (distance <= characterB.sightRange) {
    charactersInSightB.push({
      coordinates: characterA.coordinates,
      characterId: characterA.characterId,
      nickname: characterA.nickname,
      distance
    });

    characterB.characterSightFlag = true;
    characterStore.set(characterB.characterId, {
      ...characterB
    });
  }
}

export function sendCharactersInSight(
  characterId: string,
  charactersInSight: CharacterInSight[]
) {
  const character = characterStore.get(characterId);
  if (!character) {
    return;
  }

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
  characterId: string,
  encounterId: string,
  encountersInSight: EncounterInSight[]
) {
  const character = characterStore.get(characterId);

  if (!character) {
    return;
  }

  const encounter = encounterStore.get(encounterId);

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
  characterId: string,
  encountersInSight: EncounterInSight[]
) {
  const character = characterStore.get(characterId);

  if (!character) {
    return;
  }

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
