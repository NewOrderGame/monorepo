import { Socket } from 'socket.io';

let npcSocket: Socket;

export const setNpcSocket = (socket: Socket) => {
  npcSocket = socket;
};

export const getNpcSocket = () => {
  return npcSocket;
};
