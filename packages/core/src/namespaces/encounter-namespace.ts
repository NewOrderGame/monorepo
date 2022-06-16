import { NogEvent } from '@newordergame/common';
import { io } from '../lib/utils/io';
import logger from '../lib/utils/logger';
import { Namespace } from 'socket.io';
import { handleEncounterConnection } from '../lib/encounter';

let encounterNamespace: Namespace;

export const initEncounter = () => {
  logger.info('Init Encounter');
  encounterNamespace = io.of('/encounter');
  encounterNamespace.on(
    NogEvent.CONNECTION,
    handleEncounterConnection(encounterNamespace)
  );
};
