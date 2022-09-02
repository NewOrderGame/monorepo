import * as React from 'react';
import { useEffect } from 'react';
import logger from '../lib/utils/logger';
import { useMap } from 'react-leaflet';
import { Control, DomUtil, Map as LeafletMap } from 'leaflet';
import { ConnectionContextType, useConnection } from '../lib/connection';

export const WorldMenu = () => {
  const map = useMap();
  const connection = useConnection();

  useEffect(() => {
    const control = new (menuControl(connection))({ position: 'bottomleft' });
    control.addTo(map);

    return () => {
      control.remove();
    };
  }, []);

  return null;
};

const menuControl = (connection: ConnectionContextType) => {
  const button = DomUtil.create('button');
  const clickHandler = (map: LeafletMap) => (event: MouseEvent) => {
    event.stopPropagation();

    const coordinates = map.getCenter();

    logger.info('Request building entry');
    connection.gameSocket.emit('enter-building', coordinates);
  };

  return Control.extend({
    onAdd: (map: LeafletMap) => {
      button.innerHTML = 'Get into the building';
      button.addEventListener('click', clickHandler(map));
      return button;
    },

    onRemove: (map: LeafletMap) => {
      button.removeEventListener('click', clickHandler(map));
    }
  });
};
