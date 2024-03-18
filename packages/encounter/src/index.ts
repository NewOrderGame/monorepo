import { io } from 'socket.io-client';
import { logger } from '@newordergame/common';
import { NogEvent } from '@newordergame/common';
import {
  handleEnterBuilding,
  handleInitLocationSitePage
} from './lib/building-entry';
import { handleLookAround } from './lib/look-around';

if (!process.env.NOG_CORE_URL) {
  throw new Error('Environment variable NOG_CORE_URL is missing');
}
const CORE_URL = process.env.NOG_CORE_URL;

const game = io(`${CORE_URL}/game`, {
  autoConnect: false
});

game.auth = {
  encounterServiceSecret: process.env.NOG_ENCOUNTER_SERVICE_SECRET
};

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

game.on(NogEvent.ENTER_BUILDING, handleEnterBuilding(game));

game.on(NogEvent.INIT_LOCATION_SITE_PAGE, handleInitLocationSitePage(game));

game.on(NogEvent.LOOK_AROUND, handleLookAround(game));
