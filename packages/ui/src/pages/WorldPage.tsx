import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import core from '../utils/core';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import { WorldMapEngine } from '../components/WorldMapEngine';
import { MAPBOX_URL } from '../utils/constants';
import styled from 'styled-components';
import { FogOfWar } from '../components/FogOfWar';

export function WorldPage() {
  console.log('World Page');
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
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
        <WorldMapEngine />
      </MapContainer>
      <Character src="/character.png" />
      <FogOfWar width={windowWidth} height={windowHeight} />
    </>
  ) : (
    <div>Loading...</div>
  );
}

const Character = styled.img`
  position: fixed;
  width: 43px;
  height: 43px;
  top: 50%;
  left: 50%;
  margin-top: -31px;
  margin-left: -31px;
  z-index: 500;
  pointer-events: none;
`;
