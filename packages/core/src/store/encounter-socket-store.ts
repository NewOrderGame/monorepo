import { Socket } from 'socket.io';

let locationSiteBuilderSocket: Socket | null;

export const setLocationSiteBuilderSocket = (socket: Socket | null) => {
  locationSiteBuilderSocket = socket;
};

export const getLocationSiteBuilderSocket = () => {
  return locationSiteBuilderSocket;
};
