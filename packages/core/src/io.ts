import { Server } from 'socket.io';
import logger from './lib/logger';

if (!process.env.UI_ORIGIN) {
  throw logger.error('Environment variable UI_ORIGIN is missing');
}

const PORT = 5000;
export const io = new Server({
  cors: {
    origin: process.env.UI_ORIGIN
  }
});

export function listen() {
  io.listen(PORT);
}
