import { getDistance as computeDistance } from 'geolib';
import { DISTANCE_ACCURACY } from '../lib/constants';
import characterAtWorldStore from '../store/character-at-world-store';
import {
  CharacterInSight,
  EncounterInSight,
  NogCharacterId,
  NogEvent
} from '@newordergame/common';
import encounterStore from '../store/encounter-store';
import { Namespace } from 'socket.io';
import { areEnemies } from '../lib/character';

export function checkCharacterVisibility(
  characterIdA: NogCharacterId,
  characterIdB: NogCharacterId,
  charactersInSightA: CharacterInSight[],
  charactersInSightB: CharacterInSight[]
) {
  const characterAtWorldA = characterAtWorldStore.get(characterIdA);
  const characterAtWorldB = characterAtWorldStore.get(characterIdB);

  if (!characterAtWorldA || !characterAtWorldB) {
    return;
  }

  const distance = computeDistance(
    {
      latitude: characterAtWorldA.coordinates.lat,
      longitude: characterAtWorldA.coordinates.lng
    },
    {
      latitude: characterAtWorldB.coordinates.lat,
      longitude: characterAtWorldB.coordinates.lng
    },
    DISTANCE_ACCURACY
  );

  if (distance <= characterAtWorldA.stats.sightRange) {
    charactersInSightA.push({
      coordinates: characterAtWorldB.coordinates,
      characterId: characterAtWorldB.characterId,
      nickname: characterAtWorldB.nickname,
      distance,
      isEnemy: areEnemies(
        characterAtWorldA.stats.outlook,
        characterAtWorldB.stats.outlook
      )
    });

    characterAtWorldA.characterSightFlag = true;
    characterAtWorldStore.set(characterAtWorldA.characterId, {
      ...characterAtWorldA
    });
  }

  if (distance <= characterAtWorldB.stats.sightRange) {
    charactersInSightB.push({
      coordinates: characterAtWorldA.coordinates,
      characterId: characterAtWorldA.characterId,
      nickname: characterAtWorldA.nickname,
      distance,
      isEnemy: areEnemies(
        characterAtWorldA.stats.outlook,
        characterAtWorldB.stats.outlook
      )
    });

    characterAtWorldB.characterSightFlag = true;
    characterAtWorldStore.set(characterAtWorldB.characterId, {
      ...characterAtWorldB
    });
  }
}

export function sendCharactersInSight(
  characterId: NogCharacterId,
  charactersInSight: CharacterInSight[],
  world: Namespace
) {
  const characterAtWorld = characterAtWorldStore.get(characterId);
  if (!characterAtWorld) {
    return;
  }

  if (characterAtWorld.characterSightFlag) {
    world
      .to(characterAtWorld.characterId)
      .emit(NogEvent.CHARACTERS_IN_SIGHT, charactersInSight);
  }

  if (!charactersInSight.length) {
    characterAtWorld.characterSightFlag = false;
    characterAtWorldStore.set(characterAtWorld.characterId, {
      ...characterAtWorld
    });
  }
}

export function checkEncounterVisibility(
  characterId: NogCharacterId,
  encounterId: NogCharacterId,
  encountersInSight: EncounterInSight[]
) {
  const characterAtWorld = characterAtWorldStore.get(characterId);

  if (!characterAtWorld) {
    return;
  }

  const encounter = encounterStore.get(encounterId);

  const distance = computeDistance(
    {
      latitude: characterAtWorld.coordinates.lat,
      longitude: characterAtWorld.coordinates.lng
    },
    {
      latitude: encounter.coordinates.lat,
      longitude: encounter.coordinates.lng
    },
    DISTANCE_ACCURACY
  );

  if (distance < characterAtWorld.stats.sightRange) {
    encountersInSight.push({
      encounterId: encounter.encounterId,
      coordinates: encounter.coordinates,
      participants: encounter.participants,
      distance
    });

    characterAtWorld.encounterSightFlag = true;
    characterAtWorldStore.set(characterAtWorld.characterId, {
      ...characterAtWorld
    });
  }
}

export function sendEncountersInSight(
  characterId: NogCharacterId,
  encountersInSight: EncounterInSight[],
  world: Namespace
) {
  const characterAtWorld = characterAtWorldStore.get(characterId);

  if (!characterAtWorld) {
    return;
  }

  if (characterAtWorld.encounterSightFlag) {
    world
      .to(characterAtWorld.characterId)
      .emit(NogEvent.ENCOUNTERS_IN_SIGHT, encountersInSight);
  }

  if (!encountersInSight.length) {
    characterAtWorld.encounterSightFlag = false;
    characterAtWorldStore.set(characterAtWorld.characterId, {
      ...characterAtWorld
    });
  }
}
