import { io, Socket } from 'socket.io-client';

if (!process.env.NODE_ENV) {
  throw new Error('Environment variable NODE_ENV is missing');
}

if (!process.env.REACT_APP_NOG_CORE_URL_LOCAL) {
  throw new Error('Environment variable REACT_APP_NOG_CORE_URL_LOCAL is missing');
}

if (!process.env.REACT_APP_NOG_CORE_URL_PROD) {
  throw new Error(
    'Environment variable REACT_APP_NOG_CORE_URL_LOCAL is missing'
  );
}

export const CORE_URL =
  process.env.NODE_ENV === 'development'
    ? process.env.REACT_APP_NOG_CORE_URL_LOCAL
    : process.env.REACT_APP_NOG_CORE_URL_PROD;

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
