import { io, Socket } from 'socket.io-client';

if (!process.env.REACT_APP_NOG_CORE_URL) {
  throw new Error(
    'Environment variable REACT_APP_NOG_CORE_URL is missing'
  );
}

const CORE_URL = process.env.REACT_APP_NOG_CORE_URL;

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
