import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FogOfWar } from '../components/FogOfWar';
import { Loader } from '../components/Loader';
import { Content } from '../components/Content';
import { LatLng } from 'leaflet';
import { Map } from '../components/Map';
import { useConnection } from '../lib/connection';
import { NogEvent } from '@newordergame/common';

export function WorldPage() {
  console.log('World Page');
  const connection = useConnection();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [firstCoordinates, setFirstCoordinates] = useState<LatLng | null>(null);

  useEffect(() => {
    console.log('World Page init');

    connection.world.emit(NogEvent.INIT);

    connection.world.on(NogEvent.INIT, ({ coordinates }) => {
      setFirstCoordinates(coordinates);
      setLoading(false);
    });

    return () => {
      console.log('World Page destroy');
      connection.world.emit(NogEvent.DESTROY);
      connection.world.off(NogEvent.INIT);
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
      <Map firstCoordinates={firstCoordinates} />
      <Character src="/character.png" />
      <FogOfWar width={windowWidth} height={windowHeight} />
    </>
  ) : (
    <Content>
      <Loader />
    </Content>
  );
}

const Character = styled.img`
  position: fixed;
  width: 43px;
  height: 43px;
  top: 50%;
  left: 50%;
  margin-top: -21.5px;
  margin-left: -21.5px;
  z-index: 500;
  pointer-events: none;
  user-select: none;
`;
