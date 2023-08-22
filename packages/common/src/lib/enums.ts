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

export enum CellActionPermission {
  NONE,
  INTERACT,
  PASS,
  STAY,
  ACCESS_INVENTORY,
  MODIFY_EQUIPMENT,
  RESEARCH,
  ALL
}

export enum CellElement {
  'VOID' = 'void',
  'GATEWAY' = 'gateway',

  'WALL' = 'wall',
  'POST' = 'post',
  'WATER' = 'water',
  'ROCK' = 'rock',
  'TREE' = 'tree',
  'BUSH' = 'bush',
  'FURNITURE' = 'furniture',

  'FLOOR' = 'floor',
  'CARPET' = 'carpet',
  'TILE' = 'tile',
  'LAND' = 'land',
  'PATH' = 'path',
  'ROAD' = 'road',
  'RAILWAY' = 'railway',
  'PUDDLE' = 'puddle',
  'VEGETATION' = 'vegetation',

  'PIT' = 'pit',
  'HOLE' = 'hole'
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
  'TOP',
  'TOP_RIGHT',
  'BOTTOM_RIGHT',
  'BOTTOM',
  'BOTTOM_LEFT',
  'TOP_LEFT'
}

export enum HexDirectionPov {
  'FRONT',
  'FRONT_RIGHT',
  'BACK_RIGHT',
  'BACK',
  'BACK_LEFT',
  'FRONT_LEFT'
}

export enum HexDirectionCardinal {
  'N',
  'NE',
  'SE',
  'S',
  'SW',
  'NW'
}
