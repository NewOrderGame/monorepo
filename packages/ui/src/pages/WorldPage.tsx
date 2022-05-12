import * as React from 'react';
import { useEffect, useState } from 'react';
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
import { CharacterInSight } from '@newordergame/common';

const MAPBOX_URL =
  'https://api.mapbox.com/styles/v1/devlysh/cl10ns92r000814pon7kefjjt/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZGV2bHlzaCIsImEiOiJjanB5Y3dzeGgwMDA0NDhwa3M5eGtlOXBqIn0.0t-lPs1RNPM85YTIyLLbzA';

const zoomPanOptions: ZoomPanOptions = {
  animate: true,
  duration: 1,
  easeLinearity: 1
};

export function WorldPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [firstCoordinates, setFirstCoordinates] = useState(null);

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (auth.user) {
      const sessionId = window.localStorage.getItem('sessionId');
      if (sessionId) {
        core.world.auth = { sessionId };
        core.world.connect();
      } else {
        core.world.auth = { username: auth.user?.username };
        core.world.connect();
      }

      core.world.on(
        'session',
        ({ sessionId, userId, username, coordinates }) => {
          core.world.auth = { sessionId };
          localStorage.setItem('sessionId', sessionId);
          localStorage.setItem('userId', userId);
          localStorage.setItem('username', username);
          setFirstCoordinates(coordinates);
          auth.logIn({ username });
        }
      );

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
        core.world.off('connect_error');
      };
    }
  }, []);

  function handleResize() {
    setWindowWidth(window.innerWidth);
    setWindowHeight(window.innerHeight);
  }

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

var greenIcon = icon({
  iconUrl: 'character.png',
  iconSize: [32, 32] // size of the icon
});

function Map() {
  const map = useMap();

  useEffect(() => {
    let charactersInSight: (CharacterInSight & { marker: L.Marker })[] = [];

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

    core.world.on('characters-in-sight', (characters: CharacterInSight[]) => {
      charactersInSight.forEach((character) => {
        character.marker.remove();
      });

      charactersInSight = [];

      characters.forEach((character) => {
        charactersInSight.push({
          ...character,
          marker: marker(character.coordinates, { icon: greenIcon }).addTo(map)
        });
      });
    });
    return () => {
      core.world.off('move');
      core.world.off('characters-in-sight');
    };
  }, [map]);

  useMapEvents({
    click(event: LeafletMouseEvent) {
      core.world.emit('move', event.latlng);
    }
  });
  return null;
}
