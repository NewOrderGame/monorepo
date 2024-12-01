export enum NogPage {
  ROOT = '',
  CHARACTER = 'character',
  WORLD = 'world',
  ENCOUNTER = 'encounter'
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

  CREATE_CHARACTER = 'create-character',
  MOVE_CHARACTER_AT_WORLD = 'move-character-at-world',
  ENCOUNTERS_IN_SIGHT = 'encounters-in-sight',
  CHARACTERS_IN_SIGHT = 'characters-in-sight',

  EXIT_ENCOUNTER = 'exit-encounter',

  ENTER_BUILDING = 'enter-building',
  ENTER_BUILDING_COMMIT = 'enter-building-commit',

  LOOK_AROUND = 'look-around',
  LOOK_AROUND_COMMIT = 'look-around-commit',

  CREATE_ENCOUNTER = 'create-encounter',
  CREATE_ENCOUNTER_COMMIT = 'create-encounter-commit'
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
