import { io, Socket } from 'socket.io-client';

export const CORE_URL =
  process.env.NODE_ENV === 'development'
    ? 'ws://localhost:5000'
    : 'wss://core.newordergame.com';

function core() {
  const socket = io(CORE_URL, { autoConnect: false });

  return {
    socket
  };
}

export default core();
