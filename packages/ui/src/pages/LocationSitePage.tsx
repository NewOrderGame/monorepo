import { Building, Cell, NogEvent } from '@newordergame/common';
import { Application, Sprite } from 'pixi.js';
import React, {
  useCallback,
  useEffect,
  useRef,
  MutableRefObject,
  RefObject
} from 'react';
import { Socket } from 'socket.io-client';
import { Content } from '../components/Content';
import { Connection, useConnection } from '../lib/connection';
import {
  BLACK_HEXAGON,
  BLACK_TRANSPARENT_HEXAGON,
  HEXAGON_TEXTURE_HEIGHT,
  HEXAGON_TEXTURE_WIDTH,
  WHITE_HEXAGON
} from '../lib/constants';
import logger from '../lib/utils/logger';
import styled from 'styled-components';

const CanvasContainer = styled.div`
  width: 100%;

  canvas {
    width 100%;
  }
`;

export const LocationSitePage = () => {
  logger.info('Location Site Page');
  const connection = useConnection();
  const containerRef = useRef<HTMLDivElement>(null);

  useEmitInitLocationSitePage(connection);
  useOnInitLocationSitePage(connection, containerRef);

  return (
    <Content>
      <CanvasContainer ref={containerRef}></CanvasContainer>
      <ExitButton gameSocket={connection.gameSocket} />
    </Content>
  );
};

const ExitButton = ({ gameSocket }: { gameSocket: Socket }) => {
  const handleClick = useCallback(() => {
    gameSocket.emit(NogEvent.EXIT_LOCATION_SITE);
  }, [gameSocket]);

  return <button onClick={handleClick}>Let me out!</button>;
};

const useEmitInitLocationSitePage = (connection: Connection) => {
  useEffect(() => {
    connection.gameSocket.emit(NogEvent.INIT_LOCATION_SITE_PAGE);
  }, [connection.gameSocket]);
};

const useOnInitLocationSitePage = (
  connection: Connection,
  containerRef: RefObject<HTMLDivElement>
) => {
  const pixiAppRef = useRef<Application | null>(null);

  useEffect(() => {
    logger.info('Location Site Page init');

    const handler = handleInitLocationSitePage(pixiAppRef, containerRef);
    connection.gameSocket.on(NogEvent.INIT_LOCATION_SITE_PAGE, handler);

    return () => {
      logger.info('Location Site Page destroy');
      connection.gameSocket.off(NogEvent.INIT_LOCATION_SITE_PAGE, handler);
    };
  }, [connection.gameSocket, containerRef]);
};

const handleInitLocationSitePage =
  (
    pixiAppRef: MutableRefObject<Application | null>,
    containerRef: MutableRefObject<HTMLDivElement | null>
  ) =>
  (building: Building) => {
    createPixiApplication(pixiAppRef, building);
    renderBuildingOnPixiStage(pixiAppRef.current!, building);
    containerRef.current?.appendChild(pixiAppRef.current!.view);
  };

const createPixiApplication = (
  pixiAppRef: MutableRefObject<Application | null>,
  building: Building
) => {
  if (pixiAppRef.current) return;

  const width =
    (building.maxX + building.maxY + 2) * HEXAGON_TEXTURE_WIDTH -
    HEXAGON_TEXTURE_WIDTH / 2;
  const height =
    ((building.maxX + building.maxY + 2) * HEXAGON_TEXTURE_HEIGHT) / 2;
  pixiAppRef.current = new Application({
    width,
    height,
    backgroundColor: 0x1099bb
  });
};

const renderBuildingOnPixiStage = (app: Application, building: Building) => {
  for (let x = 0; x <= building.maxX; x++) {
    for (let y = 0; y <= building.maxY; y++) {
      const cell = building.map[x][y];
      const hexagon = createHexagonSprite(cell, building, x, y);
      app.stage.addChild(hexagon);
    }
  }
};

const createHexagonSprite = (
  cell: Cell,
  building: Building,
  x: number,
  y: number
) => {
  const hexagon = new Sprite(determineSprite(cell));
  hexagon.x = (building.maxY - y + x) * HEXAGON_TEXTURE_WIDTH;
  hexagon.y = ((x + y) * HEXAGON_TEXTURE_HEIGHT) / 2;
  hexagon.interactive = true;
  hexagon.buttonMode = true;
  hexagon.scale.set(HEXAGON_TEXTURE_WIDTH / 100, HEXAGON_TEXTURE_HEIGHT / 100);
  hexagon.on('pointerdown', () =>
    logger.trace({ hexagon, x, y }, 'Hexagon pointer down')
  );
  return hexagon;
};

const determineSprite = (cell: Cell) => {
  if (cell.isWall) {
    return BLACK_HEXAGON;
  } else if (cell.isInterior) {
    return WHITE_HEXAGON;
  } else {
    return BLACK_TRANSPARENT_HEXAGON;
  }
};
