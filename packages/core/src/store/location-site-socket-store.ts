import { Socket } from 'socket.io';

let locationSiteSocket: Socket | null;

export const setLocationSiteSocket = (socket: Socket | null) => {
  locationSiteSocket = socket;
};

export const getLocationSiteSocket = () => {
  return locationSiteSocket;
};
