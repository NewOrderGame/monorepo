import { Server } from 'socket.io';
import { logger } from '@newordergame/common';

const NOG_PORT = process.env.NOG_PORT;
const NOG_UI_ORIGIN = process.env.NOG_UI_ORIGIN;

if (!process.env.NOG_UI_ORIGIN) {
  throw logger.error('Environment variable NOG_UI_ORIGIN is missing');
}

export const io = new Server({
  cors: {
    origin: NOG_UI_ORIGIN
  }
});

export const listen = () => {
  io.listen(Number(NOG_PORT));
};
