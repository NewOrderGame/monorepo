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

  INIT_NPC = 'init-npc',
  DESTROY_NPC = 'destroy-npc',

  EXIT_ENCOUNTER = 'exit-encounter',

  MOVE_NPC_AT_WORLD = 'move-npc-at-world',
  CREATE_NPC = 'create-npc'
}
