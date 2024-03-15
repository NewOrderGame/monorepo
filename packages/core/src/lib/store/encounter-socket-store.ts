import { Socket } from 'socket.io';

let encounterSocket: Socket | null;

export const setLocationSiteBuilderSocket = (socket: Socket | null) => {
  encounterSocket = socket;
};

export const getLocationSiteBuilderSocket = () => {
  return encounterSocket;
};
