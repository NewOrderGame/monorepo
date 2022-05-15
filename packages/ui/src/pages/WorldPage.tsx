import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import {
  icon,
  LatLng,
  LeafletMouseEvent,
  marker,
  ZoomPanOptions
} from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useAuth } from '../utils/auth';
import core from '../utils/core';
import { useNavigate } from 'react-router-dom';
import { CharacterInSight, EncounterInSight } from '@newordergame/common';

const MAPBOX_URL =
  'https://api.mapbox.com/styles/v1/devlysh/cl10ns92r000814pon7kefjjt/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZGV2bHlzaCIsImEiOiJjanB5Y3dzeGgwMDA0NDhwa3M5eGtlOXBqIn0.0t-lPs1RNPM85YTIyLLbzA';

const zoomPanOptions: ZoomPanOptions = {
  animate: true,
  duration: 1,
  easeLinearity: 1
};

export function WorldPage() {
  console.log('World Page');
  const auth = useAuth();
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [firstCoordinates, setFirstCoordinates] = useState(null);

  const handleResize = useCallback(() => {
    setWindowWidth(window.innerWidth);
    setWindowHeight(window.innerHeight);
  }, [window.innerWidth, window.innerHeight]);

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  useEffect(() => {
    const sessionId = window.localStorage.getItem('sessionId');
    console.log(`Connecting to World`);
    if (sessionId) {
      core.world.auth = { sessionId };
      core.world.connect();
    } else {
      core.world.auth = { username: auth.user?.username };
      core.world.connect();
    }

    core.world.on(
      'session',
      ({ sessionId, userId, username, coordinates, page }) => {
        core.world.auth = { sessionId };
        localStorage.setItem('sessionId', sessionId);
        localStorage.setItem('userId', userId);
        localStorage.setItem('username', username);
        setFirstCoordinates(coordinates);
        auth.logIn({ username, page });
      }
    );

    core.world.on('logout', () => {
      navigate('/logout');
    });

    core.world.on('connect_error', (error) => {
      if (error.message === 'Invalid username') {
        navigate('/logout');
      }
    });

    return () => {
      core.world.off('connect');
      core.world.off('disconnecting');
      core.world.off('disconnect');
      core.world.off('session');
      core.world.off('logout');
      core.world.off('connect_error');
    };
  }, []);

  return firstCoordinates ? (
    <>
      <MapContainer
        center={firstCoordinates}
        zoom={18}
        scrollWheelZoom={false}
        dragging={false}
        keyboard={false}
        zoomControl={false}
        touchZoom={false}
        boxZoom={false}
      >
        <TileLayer url={MAPBOX_URL} />
        <Map />
      </MapContainer>
      <img className="character" src="/character.png" alt="" />
      <svg
        width="100%"
        height="100%"
        className="fog-of-war"
        viewBox={`0 0 ${windowWidth} ${windowHeight}`}
      >
        <defs>
          <filter id="blur" x="-20%" y="-20%" width="150%" height="150%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" />
          </filter>
        </defs>
        <mask id="mask">
          <rect fill="white" width="100%" height="100%" />
          <circle
            fill="black"
            cx="50%"
            cy="50%"
            r="240px"
            filter="url(#blur)"
          />
        </mask>
        <rect
          mask="url(#mask)"
          fill="rgba(0,0,0,0.5)"
          width="100%"
          height="100%"
        />
      </svg>
    </>
  ) : (
    <div>Loading...</div>
  );
}

var otherCharacterIcon = icon({
  iconUrl: 'other-character.png',
  iconSize: [62, 62] // size of the icon
});

var encounterIcon = icon({
  iconUrl: 'encounter.png',
  iconSize: [44, 40] // size of the icon
});

function Map() {
  const map = useMap();
  const navigate = useNavigate();

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
        map.flyTo(coordinates, map.getZoom(), { ...zoomPanOptions, duration });
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

    core.world.on('encounter', (encounter) => {
      navigate('/encounter', {
        state: encounter
      });
    });

    return () => {
      core.world.off('move');
      core.world.off('characters-in-sight');
      core.world.off('encounter');
    };
  }, [map]);

  useMapEvents({
    click(event: LeafletMouseEvent) {
      core.world.emit('move', event.latlng);
    }
  });
  return null;
}
