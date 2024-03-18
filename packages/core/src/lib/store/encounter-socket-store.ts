import { Socket } from 'socket.io';

let encounterSocket: Socket | null;

export const setEncounterSocket = (socket: Socket | null) => {
  encounterSocket = socket;
};

export const getEncounterSocket = () => {
  return encounterSocket;
};
