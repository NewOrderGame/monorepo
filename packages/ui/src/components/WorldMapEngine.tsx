import { icon, LatLng, LeafletMouseEvent, marker, Marker, ZoomPanOptions } from 'leaflet';
import { useMap, useMapEvents } from 'react-leaflet';
import { useEffect } from 'react';
import { CharacterInSight, EncounterInSight } from '../../../common';
import { useConnection } from '../utils/connection';

export function WorldMapEngine() {
  const map = useMap();
  const connection = useConnection();

  useMapEvents({
    click(event: LeafletMouseEvent) {
      console.log('Move', event.latlng);
      connection.world.emit('move', event.latlng);
    }
  });

  useEffect(() => {
    connection.world.on(
      'move',
      ({
        coordinates,
        duration,
        distance
      }: {
        coordinates: LatLng;
        duration: number;
        distance: number;
      }) => {
        console.log('Move to', coordinates, '. Distance: ', distance, 'meters');
        map.flyTo(coordinates, 18, { ...zoomPanOptions, duration });
      }
    );

    let charactersInSight: (CharacterInSight & { marker: Marker })[] = [];
    connection.world.on(
      'characters-in-sight',
      (characters: CharacterInSight[]) => {
        charactersInSight.forEach((character) => {
          character.marker.remove();
        });
        charactersInSight = [];
        characters.forEach((character) => {
          charactersInSight.push({
            ...character,
            marker: marker(character.coordinates, {
              icon: otherCharacterIcon
            }).addTo(map)
          });
        });
      }
    );

    let encountersInSight: (EncounterInSight & { marker: Marker })[] = [];
    connection.world.on(
      'encounters-in-sight',
      (encounters: EncounterInSight[]) => {
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
      }
    );

    return () => {
      connection.world.emit('destroy');
      connection.world.off('move');
      connection.world.off('characters-in-sight');
      connection.world.off('encounters-in-sight');
    };
  }, [map]);

  return null;
}

const otherCharacterIcon = icon({
  iconUrl: 'other-character.png',
  iconSize: [62, 62] // size of the icon
});

const encounterIcon = icon({
  iconUrl: 'encounter.png',
  iconSize: [44, 40] // size of the icon
});

const zoomPanOptions: ZoomPanOptions = {
  animate: true,
  duration: 1,
  easeLinearity: 1
};
