import { useEffect } from 'react';
import logger from '../lib/utils/logger';
import { useMap } from 'react-leaflet';
import { Control, DomUtil, Map as LeafletMap } from 'leaflet';
import { Connection, useConnection } from '../lib/connection';
import { NogEvent } from '@newordergame/common';

export const WorldMenu = () => {
  const map = useMap();
  const connection = useConnection();

  useInitWorldMenu(connection, map);

  return null;
};

const useInitWorldMenu = (connection: Connection, map: LeafletMap) => {
  useEffect(() => {
    const lookAroundButton = new (menuControl(
      connection,
      'Look around',
      handleLookAroundButtonClick
    ))({
      position: 'bottomleft'
    });
    lookAroundButton.addTo(map);

    return () => {
      lookAroundButton.remove();
    };
  }, []);
};

const menuControl = (
  connection: Connection,
  text: string,
  handleClick: (
    connection: Connection,
    map: LeafletMap
  ) => (event: MouseEvent) => void
) => {
  const enterBuildingButton = DomUtil.create('button');

  return Control.extend({
    onAdd: (map: LeafletMap) => {
      enterBuildingButton.innerHTML = text;
      enterBuildingButton.addEventListener(
        'click',
        handleClick(connection, map)
      );
      return enterBuildingButton;
    },

    onRemove: (map: LeafletMap) => {
      enterBuildingButton.removeEventListener(
        'click',
        handleClick(connection, map)
      );
    }
  });
};

const handleLookAroundButtonClick =
  (connection: Connection, map: LeafletMap) => (event: MouseEvent) => {
    event.stopPropagation();
    const coordinates = map.getCenter();
    connection.gameSocket.emit(NogEvent.LOOK_AROUND, coordinates);
    logger.info('Requesting look around');
  };
