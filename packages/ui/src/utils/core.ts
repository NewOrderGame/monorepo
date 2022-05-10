import { io } from 'socket.io-client';

export const CORE_URL =
  process.env.NODE_ENV === 'development'
    ? 'ws://localhost:5000'
    : 'wss://core.newordergame.com';

function core() {
  const worldNamespace = io(`${CORE_URL}/world`);

  return {
    worldNamespace
  };
}

export default core();
