export enum NogPage {
  ROOT = '',
  CHARACTER = 'character',
  WORLD = 'world',
  ENCOUNTER = 'encounter',
  LOCATION_SITE = 'location-site'
}

export enum NogNamespace {
  AUTH = 'auth',
  WORLD = 'world',
  ENCOUNTER = 'encounter'
}

export enum NogEvent {
  CONNECTION = 'connection',
  CONNECT = 'connect',
  CONNECTED = 'connected',
  DISCONNECT = 'disconnect',

  REDIRECT = 'redirect',

  INIT_ENCOUNTER_PAGE = 'init-encounter-page',
  INIT_WORLD_PAGE = 'init-world-page',
  INIT_LOCATION_SITE_PAGE = 'init-location-site-page',
  INIT_LOCATION_SITE_PAGE_COMMIT = 'init-location-site-page-commit',

  CREATE_CHARACTER = 'create-character',
  MOVE_CHARACTER_AT_WORLD = 'move-character-at-world',
  ENCOUNTERS_IN_SIGHT = 'encounters-in-sight',
  CHARACTERS_IN_SIGHT = 'characters-in-sight',

  INIT_NPC = 'init-npc',
  DESTROY_NPC = 'destroy-npc',

  EXIT_ENCOUNTER = 'exit-encounter',
  EXIT_LOCATION_SITE = 'exit-location-site',

  MOVE_NPC_AT_WORLD = 'move-npc-at-world',
  CREATE_NPC = 'create-npc',

  ENTER_BUILDING = 'enter-building',
  ENTER_BUILDING_COMMIT = 'enter-building-commit'
}

export enum HexDirectionNumeric {
  'N0',
  'N1',
  'N2',
  'N3',
  'N4',
  'N5'
}

export enum HexDirectionAngle {
  'A0',
  'A60',
  'A120',
  'A180',
  'A240',
  'A300'
}

export enum HexDirectionClock {
  'C12',
  'C2',
  'C4',
  'C6',
  'C8',
  'C10'
}

export enum HexDirectionDescriptive {
  'FRONT',
  'FRONTRIGHT',
  'BACKRIGHT',
  'BACK',
  'BACKLEFT',
  'FRONTLEFT'
}

export enum HexDirectionCardinal {
  'N',
  'NE',
  'SE',
  'S',
  'SW',
  'NW'
}
