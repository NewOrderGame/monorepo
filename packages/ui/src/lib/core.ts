import { io, Socket } from 'socket.io-client';
import logger from './utils/logger';

if (!process.env.REACT_APP_NOG_CORE_URL) {
  throw new Error('Environment variable REACT_APP_NOG_CORE_URL is missing');
}

const CORE_URL = process.env.REACT_APP_NOG_CORE_URL;

const core = () => {
  const gameSocket: Socket = io(`${CORE_URL}/game`, {
    autoConnect: false
  });

  gameSocket.onAny((event, ...args) => {
    logger.debug('event', { event, args });
  });

  return {
    gameSocket
  };
};

export default core();
