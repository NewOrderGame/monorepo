import * as React from 'react';
import { useEffect } from 'react';
import logger from '../lib/utils/logger';
import { useMap } from 'react-leaflet';
import { Control, DomUtil, Map as LeafletMap } from 'leaflet';
import { Connection, useConnection } from '../lib/connection';

export const WorldMenu = () => {
  const map = useMap();
  const connection = useConnection();

  useInitWorldMenu(connection, map);

  return null;
};

const useInitWorldMenu = (connection: Connection, map: LeafletMap) => {
  useEffect(() => {
    const control = new (menuControl(connection))({ position: 'bottomleft' });
    control.addTo(map);

    return () => {
      control.remove();
    };
  }, []);
};

const menuControl = (connection: Connection) => {
  const enterBuildingButton = DomUtil.create('button');

  return Control.extend({
    onAdd: (map: LeafletMap) => {
      enterBuildingButton.innerHTML = 'Get into the building';
      enterBuildingButton.addEventListener(
        'click',
        enterBuildingButtonClickHandler(connection, map)
      );
      return enterBuildingButton;
    },

    onRemove: (map: LeafletMap) => {
      enterBuildingButton.removeEventListener(
        'click',
        enterBuildingButtonClickHandler(connection, map)
      );
    }
  });
};

const enterBuildingButtonClickHandler =
  (connection: Connection, map: LeafletMap) => (event: MouseEvent) => {
    event.stopPropagation();
    const coordinates = map.getCenter();
    connection.gameSocket.emit('enter-building', coordinates);
    logger.info('Requesting building entry');
  };
