import { NogEvent } from '@newordergame/common';
import { io } from '../lib/utils/io';
import logger from '../lib/utils/logger';
import { Namespace } from 'socket.io';
import { handleAuthConnection } from '../lib/auth';

let authNamespace: Namespace;

export const initAuth = () => {
  logger.info('Init Auth');
  authNamespace = io.of('/auth');
  authNamespace.on(NogEvent.CONNECTION, handleAuthConnection(authNamespace));
};
