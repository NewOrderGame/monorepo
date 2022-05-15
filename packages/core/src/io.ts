import { Server } from 'socket.io';

const UI_ORIGIN =
  process.env.NODE_ENV === 'development'
    ? 'http://10.108.1.8:3000'
    : 'https://play.newordergame.com';

const PORT = 5000;
export const io = new Server({
  cors: {
    origin: UI_ORIGIN
  }
});

io.listen(PORT);
