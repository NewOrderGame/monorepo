import { Socket } from 'socket.io';

let locationSiteSocket: Socket;

export const setLocationSiteSocket = (socket: Socket) => {
  locationSiteSocket = socket;
};

export const getLocationSiteSocket = () => {
  if (!locationSiteSocket) throw new Error('Location site socket is missing');
  return locationSiteSocket;
};
