import 'dotenv/config';
import {
  checkCharacterVisibility,
  checkEncounterVisibility
} from './visibility';
import {
  Character,
  CharacterInSight,
  Encounter,
  EncounterInSight
} from '@newordergame/common';
import characterStore from '../store/character-store';
import encounterStore from '../store/encounter-store';
import { nanoid } from 'nanoid';

const DEFAULT_CHARACTER = {
  characterId: '',
  nickname: '',
  charactersInSight: [],
  encountersInSight: [] as EncounterInSight[],
  coordinates: { lat: 0, lng: 0 },
  socket: {},
  movesTo: null,
  encounterSightFlag: false,
  sightRange: 50,
  characterSightFlag: false,
  speed: 30
} as Character;

const DEFAULT_ENCOUNTER = {
  encounterId: nanoid(),
  coordinates: { lat: 0, lng: 0 },
  encounterStartTime: null,
  participants: [
    {
      ...DEFAULT_CHARACTER,
      characterId: nanoid(),
      nickname: 'A',
      charactersInSight: [],
      encountersInSight: []
    } as Character,
    {
      ...DEFAULT_CHARACTER,
      characterId: nanoid(),
      nickname: 'B',
      charactersInSight: [],
      encountersInSight: []
    } as Character
  ]
} as Encounter;

describe('Visibility module', () => {
  describe('checkCharacterVisibility. Determines whether characterB is visible for characterA', () => {
    test('Character A should see Character B', () => {
      const charactersInSight: CharacterInSight[] = [];

      const characterA = {
        ...DEFAULT_CHARACTER,
        characterId: nanoid(),
        nickname: 'A',
        coordinates: { lat: 46.47684829298625, lng: 30.730953812599186 },
        charactersInSight,
        encountersInSight: []
      } as Character;

      const characterB = {
        ...DEFAULT_CHARACTER,
        characterId: nanoid(),
        nickname: 'B',
        coordinates: { lat: 46.47684829298625, lng: 30.730953812599186 },
        charactersInSight: [],
        encountersInSight: []
      } as Character;

      characterStore.set(characterA.characterId, characterA);
      characterStore.set(characterB.characterId, characterB);

      checkCharacterVisibility(characterA, characterB, charactersInSight);

      expect(charactersInSight.length).toBe(1);
    });

    test('Character A should not see Character B', () => {
      const charactersInSight: CharacterInSight[] = [];

      const characterA = {
        ...DEFAULT_CHARACTER,
        characterId: nanoid(),
        nickname: 'A',
        coordinates: { lat: 46.47684829298625, lng: 30.730953812599186 },
        charactersInSight
      };

      const characterB = {
        ...DEFAULT_CHARACTER,
        characterId: nanoid(),
        nickname: 'B',
        coordinates: { lat: 46.47651581453476, lng: 30.73301374912262 }
      } as Character;

      characterStore.set(characterA.characterId, characterA);
      characterStore.set(characterB.characterId, characterB);

      checkCharacterVisibility(characterA, characterB, charactersInSight);

      expect(charactersInSight.length).toBe(0);
    });
  });
  describe('checkEncounterVisibility. Determines whether character sees encounter', () => {
    test('Character should see Encounter', () => {
      const encountersInSight: EncounterInSight[] = [];

      const character = {
        ...DEFAULT_CHARACTER,
        characterId: nanoid(),
        nickname: 'A',
        coordinates: { lat: 46.47684829298625, lng: 30.730953812599186 },
        charactersInSight: [],
        encountersInSight: encountersInSight
      } as Character;

      const encounter = {
        ...DEFAULT_ENCOUNTER,
        encounterId: nanoid(),
        coordinates: { lat: 46.47684829298625, lng: 30.730953812599186 }
      } as Encounter;

      characterStore.set(character.characterId, character);
      encounterStore.set(encounter.encounterId, encounter);

      checkEncounterVisibility(character, encounter, encountersInSight);

      expect(encountersInSight.length).toBe(1);
    });

    test('Character should not see Encounter', () => {
      const encountersInSight: EncounterInSight[] = [];

      const character = {
        ...DEFAULT_CHARACTER,
        characterId: nanoid(),
        nickname: 'A',
        coordinates: { lat: 46.47684829298625, lng: 30.730953812599186 },
        charactersInSight: [],
        encountersInSight: encountersInSight
      } as Character;

      const encounter = {
        ...DEFAULT_ENCOUNTER,
        encounterId: nanoid(),
        coordinates: { lat: 46.47651581453476, lng: 30.73301374912262 }
      } as Encounter;

      characterStore.set(character.characterId, character);
      encounterStore.set(encounter.encounterId, encounter);

      checkEncounterVisibility(character, encounter, encountersInSight);

      expect(encountersInSight.length).toBe(0);
    });
  });
});
