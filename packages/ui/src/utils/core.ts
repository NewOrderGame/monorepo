import { io, Socket } from 'socket.io-client';

export const CORE_URL =
  process.env.NODE_ENV === 'development'
    ? 'ws://localhost:5000'
    : 'wss://core.newordergame.com';

function core() {
  const auth: Socket = io(`${CORE_URL}/auth`, {
    autoConnect: false
  });

  const world: Socket = io(`${CORE_URL}/world`, {
    autoConnect: false
  });

  auth.onAny((event, ...args) => {
    console.log('auth |', event, args);
  });

  world.onAny((event, ...args) => {
    console.log('world |', event, args);
  });

  return {
    auth,
    world
  };
}

export default core();
