import { Socket } from 'socket.io';

let locationSiteSocket: Socket;

export const setLocationSiteSocket = (socket: Socket) => {
  locationSiteSocket = socket;
};

export const getLocationSiteSocket = () => {
  return locationSiteSocket;
};
