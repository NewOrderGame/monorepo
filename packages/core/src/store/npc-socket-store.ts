import { Socket } from 'socket.io';

let npcSocket: Socket | null;

export const setNpcSocket = (socket: Socket | null) => {
  npcSocket = socket;
};

export const getNpcSocket = () => {
  return npcSocket;
};
