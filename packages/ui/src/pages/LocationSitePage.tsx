import * as React from 'react';
import { MutableRefObject, RefObject, useEffect, useRef } from 'react';
import { Content } from '../components/Content';
import logger from '../lib/utils/logger';
import { Connection, useConnection } from '../lib/connection';
import { NogEvent } from '@newordergame/common';
import { Application, Point, Sprite } from 'pixi.js';
import {
  BLACK_HEXAGON,
  HEXAGON_TEXTURE_HEIGHT,
  HEXAGON_TEXTURE_WIDTH,
  WHITE_HEXAGON
} from '../lib/constants';
import { Socket } from 'socket.io-client';

export const LocationSitePage = () => {
  logger.info('Location Site Page');
  const connection = useConnection();
  const containerRef = useRef<HTMLDivElement>(null);
  useOnInitLocationSitePage(connection, containerRef);
  useEmitInitLocationSitePage(connection);

  return (
    <Content>
      <div ref={containerRef}></div>
      <button onClick={exitLocationSite(connection.gameSocket)}>
        Let me out!
      </button>
    </Content>
  );
};

const exitLocationSite = (gameSocket: Socket) => () => {
  gameSocket.emit(NogEvent.EXIT_LOCATION_SITE);
};

const handleInitLocationSitePage =
  (
    pixiAppRef: MutableRefObject<Application | null>,
    containerRef: MutableRefObject<HTMLDivElement | null>
  ) =>
  // TODO: Create type for Building in common module
  (building: any) => {
    logger.info('Location Site Page building a building', { building });
    const width =
      (building.maxX + building.maxY + 2) * HEXAGON_TEXTURE_WIDTH -
      HEXAGON_TEXTURE_WIDTH / 2;
    const height =
      ((building.maxX + building.maxY + 2) * HEXAGON_TEXTURE_HEIGHT) / 2;

    if (!pixiAppRef.current) {
      pixiAppRef.current = new Application({
        width,
        height,
        backgroundColor: 0x1099bb
      });
    }

    for (let x = 0; x <= building.maxX; x++) {
      for (let y = 0; y <= building.maxY; y++) {
        const cell = building.map[x][y];
        const hexagon: Sprite = new Sprite(
          cell.isWall ? BLACK_HEXAGON : WHITE_HEXAGON
        );
        hexagon.x = (building.maxY - y + x) * HEXAGON_TEXTURE_WIDTH;
        hexagon.y = ((x + y) * HEXAGON_TEXTURE_HEIGHT) / 2;
        hexagon.interactive = true;
        hexagon.buttonMode = true;
        hexagon.scale = new Point(
          HEXAGON_TEXTURE_WIDTH / 100,
          HEXAGON_TEXTURE_HEIGHT / 100
        );
        hexagon.on('pointerdown', () =>
          logger.trace('Hexagon pointer down', { hexagon, x, y })
        );
        pixiAppRef.current.stage.addChild(hexagon);
      }
    }
    containerRef.current?.appendChild(pixiAppRef.current.view);
  };

const useEmitInitLocationSitePage = (connection: any) => {
  useEffect(() => {
    connection.gameSocket.emit(NogEvent.INIT_LOCATION_SITE_PAGE);
  }, []);
};

const useOnInitLocationSitePage = (
  connection: Connection,
  containerRef: RefObject<HTMLDivElement>
) => {
  const pixiAppRef = useRef<Application>(null);

  useEffect(() => {
    logger.info('Location Site Page init');

    connection.gameSocket.on(
      NogEvent.INIT_LOCATION_SITE_PAGE,
      handleInitLocationSitePage(pixiAppRef, containerRef)
    );

    return () => {
      logger.info('Location Site Page destroy');
      connection.gameSocket.off(NogEvent.INIT_LOCATION_SITE_PAGE);
    };
  }, []);
};
