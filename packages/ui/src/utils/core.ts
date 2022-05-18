import { io, Socket } from 'socket.io-client';

export const CORE_URL =
  process.env.NODE_ENV === 'development'
    ? 'ws://10.108.1.8:5000'
    : 'wss://core.newordergame.hochburg.devlysh.com';

function core() {
  const auth: Socket = io(`${CORE_URL}/auth`, {
    autoConnect: false
  });

  const world: Socket = io(`${CORE_URL}/world`, {
    autoConnect: false
  });

  const encounter: Socket = io(`${CORE_URL}/encounter`, {
    autoConnect: false
  });

  auth.onAny((event, ...args) => {
    console.log('auth |', event, args);
  });

  world.onAny((event, ...args) => {
    console.log('world |', event, args);
  });

  encounter.onAny((event, ...args) => {
    console.log('encounter |', event, args);
  });

  return {
    auth,
    world,
    encounter
  };
}

export default core();
