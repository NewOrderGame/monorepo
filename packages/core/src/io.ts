import { Server } from 'socket.io';
import logger from './lib/utils/logger';

if (!process.env.UI_ORIGIN) {
  throw logger.error('Environment variable UI_ORIGIN is missing');
}

const PORT = 5000;

export const io = new Server({
  cors: {
    origin: process.env.UI_ORIGIN
  }
});

export const listen = () => {
  io.listen(PORT);
}
