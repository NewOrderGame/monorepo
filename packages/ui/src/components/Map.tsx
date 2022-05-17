import {
  icon,
  LatLng,
  LeafletMouseEvent,
  marker,
  ZoomPanOptions
} from 'leaflet';
import { useMap, useMapEvents } from 'react-leaflet';
import { useEffect } from 'react';
import core from '../utils/core';
import { CharacterInSight, EncounterInSight } from '../../../common';

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

export function Map() {
  const map = useMap();

  useEffect(() => {
    core.world.on(
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

    let charactersInSight: (CharacterInSight & { marker: L.Marker })[] = [];
    core.world.on('characters-in-sight', (characters: CharacterInSight[]) => {
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
    });

    let encountersInSight: (EncounterInSight & { marker: L.Marker })[] = [];
    core.world.on('encounters-in-sight', (encounters: EncounterInSight[]) => {
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
    });

    return () => {
      core.world.emit('destroy');
      core.world.off('move');
      core.world.off('characters-in-sight');
      core.world.off('encounters-in-sight');
    };
  }, [map]);

  useMapEvents({
    click(event: LeafletMouseEvent) {
      core.world.emit('move', event.latlng);
    }
  });
  return null;
}
