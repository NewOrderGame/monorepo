import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import core from '../utils/core';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import { Map } from '../components/Map';

const MAPBOX_URL =
  'https://api.mapbox.com/styles/v1/devlysh/cl10ns92r000814pon7kefjjt/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZGV2bHlzaCIsImEiOiJjanB5Y3dzeGgwMDA0NDhwa3M5eGtlOXBqIn0.0t-lPs1RNPM85YTIyLLbzA';

export function WorldPage() {
  console.log('World Page');
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [firstCoordinates, setFirstCoordinates] = useState(null);

  useEffect(() => {
    console.log('World Page init');

    core.world.emit('init');

    core.world.on('init', ({ coordinates }) => {
      setFirstCoordinates(coordinates);
      setLoading(false);
    });

    return () => {
      console.log('World Page destroy');
      core.world.emit('destroy');
      core.world.off('init');
    };
  }, [navigate]);

  const handleResize = useCallback(() => {
    setWindowWidth(window.innerWidth);
    setWindowHeight(window.innerHeight);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  return !loading && firstCoordinates ? (
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
        doubleClickZoom={false}
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
