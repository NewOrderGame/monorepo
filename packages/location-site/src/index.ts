import { io } from 'socket.io-client';
import logger from './lib/utils/logger';
import { NogEvent } from '@newordergame/common';
import { handleEnterBuilding } from './lib/building-entry';

if (!process.env.NOG_CORE_URL) {
  throw new Error('Environment variable NOG_CORE_URL is missing');
}
const CORE_URL = process.env.NOG_CORE_URL;

const game = io(`${CORE_URL}/game`, {
  autoConnect: false
});

game.auth = { locationSiteServiceSecret: 'LOCATION_SITE_SERVICE_SECRET' };

logger.info('Connecting to Game...');
game.connect();

game.on(NogEvent.CONNECT, () => {
  logger.info('Connecting...');
});

game.on(NogEvent.DISCONNECT, () => {
  logger.info('Disconnected');
});

game.on(NogEvent.CONNECTED, () => {
  logger.info('Connected to Game namespace');
});

game.on('enter-building', handleEnterBuilding(game));
