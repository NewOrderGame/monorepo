import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { FogOfWar } from '../components/FogOfWar';
import { Loader } from '../components/Loader';
import { Content } from '../components/Content';
import { LatLng } from 'leaflet';
import { Map } from '../components/Map';
import { useConnection } from '../lib/connection';
import { NogEvent } from '@newordergame/common';
import logger from '../lib/utils/logger';

export const WorldPage = () => {
  logger.info('World Page');
  const connection = useConnection();
  const [loading, setLoading] = useState<boolean>(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [firstCoordinates, setFirstCoordinates] = useState<LatLng | null>(null);

  useEffect(() => {
    logger.info('World Page init');

    connection.gameSocket.emit(NogEvent.INIT_CHARACTER_AT_WORLD);

    connection.gameSocket.on(
      NogEvent.INIT_CHARACTER_AT_WORLD,
      ({ coordinates }) => {
        setFirstCoordinates(coordinates);
        setLoading(false);
      }
    );

    return () => {
      logger.info('World Page destroy');
      connection.gameSocket.emit(NogEvent.DESTROY_CHARACTER_AT_WORLD);
      connection.gameSocket.off(NogEvent.INIT_CHARACTER_AT_WORLD);
    };
  }, [connection]);

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
};

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
