import { Server } from 'socket.io';
import { User } from '@newordergame/common/index';

const UI_ORIGIN =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://play.newordergame.com';

const io = new Server({
  cors: {
    origin: UI_ORIGIN
  }
});

io.of('/world').on('connection', (socket) => {
  console.log(socket.id);

  socket.emit('message', 'Hello from server!');
  socket.on('auth', ({ user }: { user: User }) => {
    socket.data.user = user;
    console.log(`${socket.data.user.username} Connected`);
  });

  socket.on('disconnect', () => {
    console.log(`${socket.data.user.username} disconnected`);
  });
});

io.listen(5000);
