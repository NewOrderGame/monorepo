import {
  icon,
  LeafletMouseEvent,
  Map as LeafletMap,
  Marker,
  marker,
  ZoomPanOptions
} from 'leaflet';
import { useMap, useMapEvents } from 'react-leaflet';
import { useEffect } from 'react';
import { Connection, useConnection } from '../lib/connection';
import {
  GeoCoordinates,
  NogEvent,
  IndoorHexMap,
  CharacterInSight,
  EncounterInSight
} from '@newordergame/common';
import logger from '../lib/utils/logger';

export const WorldMapEngine = () => {
  const map = useMap();
  const connection = useConnection();

  useMapEvents({
    click(event: LeafletMouseEvent) {
      logger.info({ coordinates: event.latlng }, 'Request movement');
      connection.gameSocket.emit(
        NogEvent.MOVE_CHARACTER_AT_WORLD,
        event.latlng
      );
    }
  });

  useAddConnectionSocketsEventListeners(connection, map);

  return null;
};

const useAddConnectionSocketsEventListeners = (
  connection: Connection,
  map: LeafletMap
) => {
  useEffect(() => {
    connection.gameSocket.on(
      NogEvent.MOVE_CHARACTER_AT_WORLD,
      handleMoveCharacterAtWorld(map)
    );

    connection.gameSocket.on(
      NogEvent.ENCOUNTERS_IN_SIGHT,
      handleEncountersInSight(map)
    );

    connection.gameSocket.on(
      NogEvent.CHARACTERS_IN_SIGHT,
      handleCharactersInSight(map)
    );

    connection.gameSocket.on(NogEvent.ENTER_BUILDING, handleEnterBuilding);

    return () => {
      connection.gameSocket.off(NogEvent.MOVE_CHARACTER_AT_WORLD);
      connection.gameSocket.off(NogEvent.CHARACTERS_IN_SIGHT);
      connection.gameSocket.off(NogEvent.ENCOUNTERS_IN_SIGHT);
      connection.gameSocket.off(NogEvent.ENTER_BUILDING);
    };
  }, [connection.gameSocket, map]);
};

const handleEnterBuilding = (building: IndoorHexMap) => {
  logger.info({ building }, 'Commit building entry');
};

let charactersInSight: (CharacterInSight & { marker: Marker })[] = [];
const handleCharactersInSight =
  (map: LeafletMap) =>
  (event: { characterId: string; charactersInSight: CharacterInSight[] }) => {
    charactersInSight.forEach((character) => {
      character.marker.remove();
    });
    charactersInSight = [];
    event.charactersInSight.forEach((character) => {
      charactersInSight.push({
        ...character,
        marker: marker(character.coordinates, {
          icon: character.isEnemy ? enemyCharacterIcon : otherCharacterIcon
        }).addTo(map)
      });
    });
  };

let encountersInSight: (EncounterInSight & { marker: Marker })[] = [];
const handleEncountersInSight =
  (map: LeafletMap) => (encounters: EncounterInSight[]) => {
    encountersInSight.forEach((character) => {
      character.marker.remove();
    });
    encountersInSight = [];
    encounters.forEach((character) => {
      encountersInSight.push({
        ...character,
        marker: marker(character.coordinates, {
          icon: encounterIcon
        }).addTo(map)
      });
    });
  };

const handleMoveCharacterAtWorld =
  (map: LeafletMap) =>
  ({
    coordinates,
    duration,
    distance
  }: {
    coordinates: GeoCoordinates;
    duration: number;
    distance: number;
  }) => {
    logger.info({ coordinates, distance }, 'Commit movement');
    map.flyTo(coordinates, 18, {
      ...zoomPanOptions,
      duration
    });
  };

const otherCharacterIcon = icon({
  iconUrl: 'other-character.png',
  iconSize: [62, 62]
});

const enemyCharacterIcon = icon({
  iconUrl: 'enemy-character.png',
  iconSize: [62, 62]
});

const encounterIcon = icon({
  iconUrl: 'encounter.png',
  iconSize: [44, 40]
});

const zoomPanOptions: ZoomPanOptions = {
  animate: true,
  easeLinearity: 1
};
