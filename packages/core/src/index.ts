import { Server } from 'socket.io';

const io = new Server({
  cors: {
    origin: 'http://localhost:3000'
  }
});

const UI_ORIGIN =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://play.newordergame.com';

io.on('connection', (socket) => {
  console.log(socket.id);

  socket.emit('message', 'hello from server!');

  socket.on('message', (message) => {
    console.log(message);
  });
});

io.listen(5000);
